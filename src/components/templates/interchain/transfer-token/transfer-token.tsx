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
  const toast = useToast();

  return (
    <Box padding="7" maxW="xxl" borderWidth="1px" borderRadius="lg" overflow="hidden" margin="auto" marginTop="-20">
      <Heading size="lg" marginBottom="6" textAlign="center">
        Transfer Interchain Token
      </Heading>
      <VStack spacing={5} align="stretch">
        <FormControl>
          <FormLabel>Source Chain Name</FormLabel>
          <Stack spacing={3}>
            <Select placeholder="Select source chain" size="md">
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
          <Input placeholder="Enter Token Contract Address" />
          <FormHelperText>Contract address of the token you want to transfer.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Destination Chain</FormLabel>
          <Stack spacing={3}>
            <Select placeholder="Select Destination chain" size="md">
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
          <Input placeholder="Enter Receiver Address" />
          <FormHelperText>Receiver address for your token.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Amount to Transfer</FormLabel>
          <Input placeholder="Enter Amount to Transfer" />
          <FormHelperText>Amount to transfer to the receiver address.</FormHelperText>
        </FormControl>
        <Button colorScheme="cyan" loadingText="Transferring Token..." w="sm" variant="solid">
          Transfer Token
        </Button>
      </VStack>
    </Box>
  );
};

export default TransferToken;
