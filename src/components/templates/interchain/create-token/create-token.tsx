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

const NewInterchainToken: React.FC = () => {
  const { address } = useAccount();
  const toast = useToast();
  const [displayTransactionHash, setDisplayTransactionHash] = useState<string>('');
  const [showNextStep, setShowNextStep] = useState<boolean>(false);

  return (
    <Box padding="7" maxW="xxl" borderWidth="1px" borderRadius="lg" overflow="hidden" margin="auto" marginTop="-20">
      <Heading size="lg" marginBottom="6" textAlign="center">
        Create a New Interchain Token
      </Heading>
      <VStack spacing={5} align="stretch">
        <FormControl>
          <FormLabel>Token Name</FormLabel>
          <Input placeholder="Enter token name" />
          <FormHelperText>Unique name for your token.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Token Symbol</FormLabel>
          <Input placeholder="Enter token symbol" />
          <FormHelperText>Short symbol for your token, like ETH or BTC.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Token Decimals</FormLabel>
          <Input type="number" placeholder="Enter token decimals" />
          <FormHelperText>Number of decimal places for your token.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Initial Supply</FormLabel>
          <Input type="number" placeholder="Enter initial supply" />
          <FormHelperText>Total initial supply of tokens.</FormHelperText>
        </FormControl>
        <Text fontSize="sm" color="gray.500">
          Unique Salt:
        </Text>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button colorScheme="cyan" loadingText="Creating Token" w="sm" variant="solid">
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
