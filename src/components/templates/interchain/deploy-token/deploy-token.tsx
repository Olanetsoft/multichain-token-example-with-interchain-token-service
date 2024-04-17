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
import { ethers } from 'ethers';

import interchainTokenFactoryContractABI from '../../../../../contracts/InterchainTokenFactoryABI.json';
const interchainTokenFactoryContractAddress = '0x83a93500d23Fbc3e82B410aD07A6a9F7A0670D66';

const DeployTokenRemotely = () => {
  const { address } = useAccount();
  const toast = useToast();
  const [displayTransactionHash, setDisplayTransactionHash] = useState<string>('');
  const [showNextStep, setShowNextStep] = useState<boolean>(false);

  return (
    <Box padding="7" maxW="xxl" borderWidth="1px" borderRadius="lg" overflow="hidden" margin="auto" marginTop="-20">
      <Heading size="lg" marginBottom="6" textAlign="center">
        Deploy Interchain Token Remotely
      </Heading>
      <VStack spacing={5} align="stretch">
        <FormControl>
          <FormLabel>Your unique salt value</FormLabel>
          <Input placeholder="Enter Salt Value" />
          <FormHelperText>Unique salt value for your token.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Source chain</FormLabel>
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
          <FormLabel>Destination chain</FormLabel>
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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button colorScheme="cyan" loadingText="Deploying Token Remotely..." w="sm" variant="solid">
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
