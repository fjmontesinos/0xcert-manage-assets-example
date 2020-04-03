import { MetamaskProvider } from "@0xcert/ethereum-metamask-provider";
import { config } from "./config";
import {
  AssetLedger,
  AssetLedgerCapability
} from "@0xcert/ethereum-asset-ledger";

// We create a new instance of metamask provider.
const provider = new MetamaskProvider(config.providerConfig);

export async function enableMetamask() {
  // We first check if metamask is already enabled.
  if (!(await provider.isEnabled())) {
    // If metamask is not enabled, we enable it.
    await provider.enable();
  }
}

export async function deployAssetLedger() {
  await enableMetamask();
  const mutation = await AssetLedger.deploy(provider, {
    name: "Títulos académicos UNIR",
    symbol: "TAU",
    uriPrefix: "https://0xcert.org/assets/",
    uriPostfix: ".json",
    schemaId:
      "fc200d1535b2c90c044b7ce8517c680a7e5bf95015a449c3399e16401b657c77", // base asset schemaId
    capabilities: [
      AssetLedgerCapability.TOGGLE_TRANSFERS,
      AssetLedgerCapability.DESTROY_ASSET,
      AssetLedgerCapability.REVOKE_ASSET,
      AssetLedgerCapability.UPDATE_ASSET
    ]
  }).catch(e => {
    throw e;
  });
  mutation.complete().then(m => {
    config.assetLedgerSource = m.receiverId; // Address of the created smart contract.
  });
  return mutation;
}

export async function getAssetLedgerInfo() {
  await enableMetamask();
  const assetLedger = AssetLedger.getInstance(
    provider,
    config.assetLedgerSource
  );
  return assetLedger.getInfo();
}

export async function getAssetOwner() {
  await enableMetamask();
  const assetLedger = AssetLedger.getInstance(
    provider,
    config.assetLedgerSource
  );
  return assetLedger.getAssetAccount("100");
}

export async function createNewAsset() {
  await enableMetamask();
  const assetLedger = AssetLedger.getInstance(
    provider,
    config.assetLedgerSource
  );
  return assetLedger.createAsset({
    receiverId: "0xe192A3d081B7345dDB160834A388908714039f1A",
    imprint: "bf31e6546890fe7b8dfc87eb73d6221834960240607af90f1f9caa987df481a6",
    id: "102"
  });
}

export async function transferAsset() {
  await enableMetamask();
  const assetLedger = AssetLedger.getInstance(
    provider,
    config.assetLedgerSource
  );
  return assetLedger.transferAsset({
    receiverId: "0x60830a96c835C488A53ac763270d701748505298", // Change with your address otherwise it will be sent to us. :)
    id: "101"
  });
}

export async function revokeAsset() {
  await enableMetamask();
  const assetLedger = AssetLedger.getInstance(
    provider,
    config.assetLedgerSource
  );
  return assetLedger.revokeAsset("101");
}

// todo verificar como debe funcionar
export async function destroyAsset() {
  await enableMetamask();
  const assetLedger = AssetLedger.getInstance(
    provider,
    config.assetLedgerSource
  );
  return assetLedger.destroyAsset("101");
}
