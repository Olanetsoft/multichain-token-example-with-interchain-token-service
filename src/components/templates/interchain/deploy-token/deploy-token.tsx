import {
  VStack,
  Heading,
  Box,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Alert,
  AlertIcon,
  Link,
  useToast,
  Stack,
  Select,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useContractWrite, useWaitForTransaction, useAccount, ContractWriteResult } from 'wagmi';
import { AxelarQueryAPI, Environment, EvmChain, GasToken } from '@axelar-network/axelarjs-sdk';
import interchainTokenFactoryContractABI from '../../../../../contracts/InterchainTokenFactoryABI.json';
import { ethers } from 'ethers';

const interchainTokenFactoryContractAddress = '0x83a93500d23Fbc3e82B410aD07A6a9F7A0670D66';

const DeployTokenRemotely = () => {
  const { address } = useAccount();
  const [displayTransactionHash, setDisplayTransactionHash] = useState<string>('');
  const [sourceChain, setSourceChain] = useState<string>('');
  const [destinationChain, setDestinationChain] = useState<string>('');
  const [saltValue, setSaltValue] = useState<string>('');
  const [showNextStep, setShowNextStep] = useState<boolean>(false);

  const api: AxelarQueryAPI = new AxelarQueryAPI({ environment: Environment.TESTNET });
  const [gasAmount, setGasAmount] = useState<number>(0);

  const toast = useToast();

  // Estimate Gas
  const gasEstimator = async () => {
    try {
      const gas = await api.estimateGasFee(sourceChain, destinationChain, GasToken.FTM, 700000, 2);

      setGasAmount(Number(gas));
    } catch (error) {
      console.error('Error estimating gas fee: ', error);
    }
  };

  // Deploy Token Remotely
  const { data: deployTokenRemotely, write } = useContractWrite({
    address: interchainTokenFactoryContractAddress,
    abi: interchainTokenFactoryContractABI,
    functionName: 'deployRemoteInterchainToken',
    args: [sourceChain, saltValue, address, destinationChain, ethers.BigNumber.from(gasAmount.toString())],
    overrides: {
      value: ethers.BigNumber.from(gasAmount.toString()),
    },
    mode: 'recklesslyUnprepared',
  });

  const {
    data: useWaitForDeployTokenRemotelyTransactionData,
    isSuccess,
    isError,
    isLoading,
  } = useWaitForTransaction({
    // Calling a hook to wait for the transaction to be mined
    hash: deployTokenRemotely?.hash,
  });

  const handleDeployToken = async () => {
    if (write) {
      write();
      toast({
        title: 'Transaction Submitted',
        description: 'Please confirm the transaction in MetaMask.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }

    if (isError) {
      toast({
        title: 'Transaction Error',
        description: 'There was an error submitting your transaction.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    gasEstimator();
    if (isSuccess) {
      setDisplayTransactionHash(deployTokenRemotely?.hash ?? '');
      toast({
        title: 'Token Deployed Remotely',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setShowNextStep(true);
    }

    if (isError) {
      toast({
        title: 'Transaction Error',
        description: 'There was an error submitting your transaction.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    if (isLoading) {
      toast({
        title: 'Transaction Pending',
        description: 'Your transaction is pending.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [deployTokenRemotely, isSuccess, isError, isLoading, useWaitForDeployTokenRemotelyTransactionData]);

  return (
    <Box padding="7" maxW="xxl" borderWidth="1px" borderRadius="lg" overflow="hidden" margin="auto" marginTop="-20">
      <Heading size="lg" marginBottom="6" textAlign="center">
        Deploy Interchain Token Remotely
      </Heading>
      <VStack spacing={5} align="stretch">
        <FormControl>
          <FormLabel>Your unique salt value</FormLabel>
          <Input placeholder="Enter Salt Value" value={saltValue} onChange={(e) => setSaltValue(e.target.value)} />
          <FormHelperText>Unique salt value for your token.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Source chain</FormLabel>
          <Stack spacing={3}>
            <Select
              placeholder="Select source chain"
              value={sourceChain}
              onChange={(e) => setSourceChain(e.target.value)}
              size="md"
            >
              <option value="Fantom">Fantom</option>
              <option value="celo">Celo</option>
              <option value="binance">Binance</option>
              <option value="Polygon">Polygon</option>
              <option value="Avalanche">Avalanche</option>
              <option value="ethereum-sepolia">Ethereum Sepolia</option>
            </Select>
          </Stack>
          <FormHelperText>Source chain for your token eg. Fantom, binance, Polygon etc.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Destination chain</FormLabel>
          <Stack spacing={3}>
            <Select
              placeholder="Select Destination chain"
              value={destinationChain}
              onChange={(e) => setDestinationChain(e.target.value)}
              size="md"
            >
              <option value="Fantom">Fantom</option>
              <option value="celo">Celo</option>
              <option value="binance">Binance</option>
              <option value="Polygon">Polygon</option>
              <option value="Avalanche">Avalanche</option>
              <option value="ethereum-sepolia">Ethereum Sepolia</option>
            </Select>
          </Stack>
          <FormHelperText>Destination chain for your token eg. Fantom, binance, Polygon etc.</FormHelperText>
        </FormControl>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            colorScheme="cyan"
            onClick={handleDeployToken}
            isLoading={isLoading}
            loadingText="Deploying Token Remotely..."
            w="sm"
            variant="solid"
            disabled={isLoading}
          >
            Deploy Token Remotely
          </Button>
          {showNextStep && (
            <Button
              colorScheme="green"
              onClick={() => {
                window.location.href = '/interchain/transfer-token';
              }}
              w="sm"
              variant="solid"
            >
              Bridge Token
            </Button>
          )}
        </div>

        {displayTransactionHash && (
          <Alert status="info" variant="left-accent" marginTop="2" marginBottom="2">
            <AlertIcon />
            Transaction Hash:
            <Link
              href={`https://testnet.axelarscan.io/gmp/${displayTransactionHash}`}
              isExternal
              color="blue.500"
              paddingLeft="2"
            >
              {displayTransactionHash}
            </Link>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default DeployTokenRemotely;
