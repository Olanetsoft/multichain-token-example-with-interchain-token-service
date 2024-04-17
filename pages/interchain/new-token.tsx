import { Default } from 'components/layouts/Default';
import { NewInterchainToken } from 'components/templates/interchain/create-token';

const InterchainToken = () => {
  return (
    <Default pageName="Create a new Interchain Token">
      <NewInterchainToken />
    </Default>
  );
};

export default InterchainToken;
