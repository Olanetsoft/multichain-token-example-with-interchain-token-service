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
  const toast = useToast();

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
        </div>
      </VStack>
    </Box>
  );
};

export default NewInterchainToken;
