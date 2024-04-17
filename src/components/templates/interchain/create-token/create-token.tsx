import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { useContractWrite, useWaitForTransaction, useAccount } from 'wagmi';
import crypto from 'crypto';
import { ethers } from 'ethers';
import interchainTokenFactoryContractABI from '../../../../../contracts/InterchainTokenFactoryABI.json';

const interchainTokenFactoryContractAddress = '0x83a93500d23Fbc3e82B410aD07A6a9F7A0670D66';

const NewInterchainToken: React.FC = () => {
  const { address } = useAccount();
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);
  const [initialSupply, setInitialSupply] = useState<number>(0);
  const [displayTransactionHash, setDisplayTransactionHash] = useState<string>('');
  const [showNextStep, setShowNextStep] = useState<boolean>(false);

  const [saltValue, setSaltValue] = useState<string>('');

  const toast = useToast();

  // Create a New Token
  const { data: createNewToken, write } = useContractWrite({
    address: interchainTokenFactoryContractAddress,
    abi: interchainTokenFactoryContractABI,
    functionName: 'deployInterchainToken',
    args: [
      saltValue,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      ethers.utils.parseEther(initialSupply.toString()),
      address,
    ],
    mode: 'recklesslyUnprepared',
  });

  const {
    data: useWaitForDeployTokenTransactionData,
    isSuccess,
    isError,
    isLoading,
  } = useWaitForTransaction({
    hash: createNewToken?.hash,
  });

  const handleCreateToken = async () => {
    if (!tokenName || !tokenSymbol || tokenDecimals < 0 || initialSupply <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please fill all the fields correctly.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    write();
    toast({
      title: 'Transaction Submitted',
      description: 'Please confirm the transaction in MetaMask.',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  useEffect(() => {
    const localSaltValue = `0x${crypto.randomBytes(32).toString('hex')}`;
    setSaltValue(localSaltValue);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setDisplayTransactionHash(createNewToken?.hash ?? '');

      toast({
        title: 'New Interchain Token Created',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Clear only the input fields
      setTokenName('');
      setTokenSymbol('');
      setTokenDecimals(18);
      setInitialSupply(0);
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
  }, [createNewToken, isSuccess, isError, isLoading, useWaitForDeployTokenTransactionData]);

  return (
    <Box padding="7" maxW="xxl" borderWidth="1px" borderRadius="lg" overflow="hidden" margin="auto" marginTop="-20">
      <Heading size="lg" marginBottom="6" textAlign="center">
        Create a New Interchain Token
      </Heading>
      <VStack spacing={5} align="stretch">
        <FormControl>
          <FormLabel>Token Name</FormLabel>
          <Input placeholder="Enter token name" value={tokenName} onChange={(e) => setTokenName(e.target.value)} />
          <FormHelperText>Unique name for your token.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Token Symbol</FormLabel>
          <Input
            placeholder="Enter token symbol"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
          />
          <FormHelperText>Short symbol for your token, like ETH or BTC.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Token Decimals</FormLabel>
          <Input
            type="number"
            placeholder="Enter token decimals"
            value={tokenDecimals.toString()}
            onChange={(e) => setTokenDecimals(Number(e.target.value))}
          />
          <FormHelperText>Number of decimal places for your token.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Initial Supply</FormLabel>
          <Input
            type="number"
            placeholder="Enter initial supply"
            value={initialSupply.toString()}
            onChange={(e) => setInitialSupply(Number(e.target.value))}
          />
          <FormHelperText>Total initial supply of tokens.</FormHelperText>
        </FormControl>
        <Text fontSize="sm" color="gray.500">
          Unique Salt: {saltValue}
        </Text>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            colorScheme="cyan"
            onClick={handleCreateToken}
            isLoading={isLoading}
            loadingText="Creating Token"
            w="sm"
            variant="solid"
            disabled={isLoading}
          >
            Create Token
          </Button>

          {showNextStep && (
            <Button
              colorScheme="green"
              onClick={() => {
                window.location.href = '/interchain/deploy-token';
              }}
              w="sm"
              variant="solid"
            >
              Deploy Token Remotely
            </Button>
          )}
        </div>

        {displayTransactionHash && (
          <Alert status="info" variant="left-accent" marginTop="2" marginBottom="2">
            <AlertIcon />
            Transaction Hash:
            <Link
              href={`https://testnet.ftmscan.com/tx/${displayTransactionHash}`}
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

export default NewInterchainToken;
