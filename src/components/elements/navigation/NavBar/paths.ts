import { ISubNav } from '../SubNav/SubNav';

const NAV_LINKS: ISubNav[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Transactions',
    href: '/transactions',
  },
  {
    label: 'Transfers',
    href: '/transfers',
    children: [
      {
        label: 'ERC20',
        subLabel: 'Get your ERC20 transfers',
        href: '/transfers/erc20',
        logo: 'token',
      },
      {
        label: 'NFT',
        subLabel: 'Get your ERC721 an ERC1155 transfers',
        href: '/transfers/nft',
        logo: 'lazyNft',
      },
    ],
  },
  {
    label: 'Balances',
    href: '/balances',
    children: [
      {
        label: 'ERC20',
        subLabel: 'Get your ERC20 balances',
        href: '/balances/erc20',
        logo: 'token',
      },
      {
        label: 'NFT',
        subLabel: 'Get your ERC721 an ERC1155 balances',
        href: '/balances/nft',
        logo: 'pack',
      },
    ],
  },
  {
    label: 'Interchain Tokens',
    href: '/interchain',
    children: [
      {
        label: 'Create a new token',
        subLabel: 'Create a new Interchain Token',
        href: '/interchain/new-token',
        logo: 'token',
      },
      {
        label: 'Deploy token remotely',
        subLabel: 'Deploy an Interchain Token remotely',
        href: '/interchain/deploy-token',
        logo: 'wizard',
      },
      {
        label: 'Transfer token',
        subLabel: 'Transfer an Interchain Token',
        href: '/interchain/transfer-token',
        logo: 'bundle',
      },
    ],
  },
];

export default NAV_LINKS;
