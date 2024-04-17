import { Default } from 'components/layouts/Default';
import { TransferToken } from 'components/templates/interchain/transfer-token';

const TransferInterchainToken = () => {
  return (
    <Default pageName="Deploy an Interchain Token remotely">
      <TransferToken />
    </Default>
  );
};

export default TransferInterchainToken;
