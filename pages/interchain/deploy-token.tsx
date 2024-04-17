import { Default } from 'components/layouts/Default';
import { DeployTokenRemotely } from 'components/templates/interchain/deploy-token';

const DeployToken = () => {
  return (
    <Default pageName="Deploy an Interchain Token remotely">
      <DeployTokenRemotely />
    </Default>
  );
};

export default DeployToken;
