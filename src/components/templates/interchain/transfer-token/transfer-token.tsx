import {
  VStack,
  Heading,
  Box,
  Text,
  Button,
  Input,
  useToast,
  FormControl,
  FormLabel,
  FormHelperText,
  Alert,
  AlertIcon,
  Link,
  Stack,
  Select,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { AxelarQueryAPI, Environment, EvmChain, GasToken } from '@axelar-network/axelarjs-sdk';

import interchainTokenContractABI from '../../../../../contracts/interchainTokenABI.json';

import { ethers } from 'ethers';

const TransferToken = () => {
  const [displayTransactionHash, setDisplayTransactionHash] = useState<string>('');

  const [sourceChain, setSourceChain] = useState<string>('');
  const [destinationChain, setDestinationChain] = useState<string>('');
  const [receiverAddress, setReceiverAddress] = useState<string>('');
  const [amountToTransfer, setAmountToTransfer] = useState<number>(0);
  const [interchainTokenContractAddress, setInterchainTokenContractAddress] = useState<string>('');

  const api = new AxelarQueryAPI({ environment: Environment.TESTNET });
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

  // Token Transfer
  const { data: tokenTransfer, write } = useContractWrite({
    address: interchainTokenContractAddress,
    abi: interchainTokenContractABI,
    functionName: 'interchainTransfer',
    args: [destinationChain, receiverAddress, ethers.utils.parseEther(amountToTransfer.toString()), '0x'],
    overrides: {
      value: ethers.BigNumber.from(gasAmount.toString()),
    },
    mode: 'recklesslyUnprepared',
  });

  const {
    data: useWaitForTokenTransferTransactionData,
    isSuccess,
    isError,
    isLoading,
  } = useWaitForTransaction({
    // Calling a hook to wait for the transaction to be mined
    hash: tokenTransfer?.hash,
  });

  const handleTokenTransfer = async () => {
    if (!sourceChain || !destinationChain || !receiverAddress || !amountToTransfer) {
      toast({
        title: 'Invalid Input',
        description: 'Please fill all the fields correctly.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (write) {
      write();
      toast({
        title: 'Transaction Submitted',
        description: 'Please confirm the transaction in Metamask.',
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
      setDisplayTransactionHash(tokenTransfer?.hash ?? '');
      toast({
        title: 'Token Transfer Initiated',
        status: 'success',
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

    if (isLoading) {
      toast({
        title: 'Transaction Pending',
        description: 'Your transaction is pending.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [tokenTransfer, isSuccess, isError, isLoading, useWaitForTokenTransferTransactionData]);

  return (
    <Box padding="7" maxW="xxl" borderWidth="1px" borderRadius="lg" overflow="hidden" margin="auto" marginTop="-20">
      <Heading size="lg" marginBottom="6" textAlign="center">
        Transfer Interchain Token
      </Heading>
      <VStack spacing={5} align="stretch">
        <FormControl>
          <FormLabel>Source Chain Name</FormLabel>
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
          <FormLabel>Token Contract Address</FormLabel>
          <Input
            placeholder="Enter Token Contract Address"
            value={interchainTokenContractAddress}
            onChange={(e) => setInterchainTokenContractAddress(e.target.value)}
          />
          <FormHelperText>Contract address of the token you want to transfer.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Destination Chain</FormLabel>
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
        <FormControl>
          <FormLabel>Receiver Address</FormLabel>
          <Input
            placeholder="Enter Receiver Address"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
          />
          <FormHelperText>Receiver address for your token.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Amount to Transfer</FormLabel>
          <Input
            placeholder="Enter Amount to Transfer"
            value={amountToTransfer}
            onChange={(e) => setAmountToTransfer(Number(e.target.value))}
          />
          <FormHelperText>Amount to transfer to the receiver address.</FormHelperText>
        </FormControl>
        <Button
          colorScheme="cyan"
          onClick={handleTokenTransfer}
          isLoading={isLoading}
          loadingText="Transferring Token..."
          w="sm"
          variant="solid"
          disabled={isLoading}
        >
          Transfer Token
        </Button>

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

export default TransferToken;
