import { StandardRollup } from '@sovereign-sdk/web3';
import { Address } from 'viem';

import { Domain, HexString } from '@hyperlane-xyz/utils';

import { BaseSovereignAdapter } from '../../app/MultiProtocolApp.js';
import { MultiProtocolProvider } from '../../providers/MultiProtocolProvider.js';
import {
  ProviderType,
  TypedTransactionReceipt,
} from '../../providers/ProviderType.js';
import { ChainName } from '../../types.js';

import { ICoreAdapter } from './types.js';

export class SovereignCoreAdapter
  extends BaseSovereignAdapter
  implements ICoreAdapter
{
  constructor(
    chainName: ChainName,
    multiProvider: MultiProtocolProvider,
    addresses: Record<string, Address>,
  ) {
    super(chainName, multiProvider, addresses);
  }

  public getProvider(): Promise<StandardRollup<any>> {
    return this.multiProvider.getSovereignProvider(this.chainName);
  }

  extractMessageIds(
    r: TypedTransactionReceipt,
  ): Array<{ messageId: HexString; destination: ChainName }> {
    if (r.type !== ProviderType.Sovereign) {
      throw new Error(
        `Unsupported provider type for SovereignCoreAdapter ${r.type}`,
      );
    }

    const dispatchEvents = r.receipt.response?.data.events?.filter(
      (e) => e.key === 'Mailbox/DispatchId' || e.key === 'Mailbox/Dispatch',
    );
    if (!dispatchEvents) {
      throw new Error('No dispatch events found');
    }
    // Events will always have the patterh `Dispatch` (which contains the destination domain) immedately followed by `DispatchId` (which contains the message id)
    const result: Array<{ messageId: HexString; destination: ChainName }> = [];
    for (let i = 0; i < dispatchEvents.length; i += 2) {
      const dispatchEvent = dispatchEvents[i];
      const dispatchIdEvent = dispatchEvents[i + 1];
      // Here's an example dispatch event:
      // {"data":{"type":"event","number":21,"key":"Mailbox/Dispatch","value":{"dispatch":{"sender":"0xe14e75006fa7444985b9876c71b6a7689631af98658b10598c5151f18490e812","destination_domain":1399811150,"recipient_address":"0x264ae4d8bb90248557e7e039afaf384b64fbc821e56f45ebb524d74dfe8cc30d","message":"0x0300000000000015b3e14e75006fa7444985b9876c71b6a7689631af98658b10598c5151f18490e812536f6c4e264ae4d8bb90248557e7e039afaf384b64fbc821e56f45ebb524d74dfe8cc30dc7589c5b37e68fea5e4d22423ab074446c29f737663905b6def7359547d7cb5e0000000000000000000000000000000000000000000000000000000000000001"}},"module":{"type":"moduleRef","name":"Mailbox"}},"meta":{}}%
      // And here's the DispatchId event:
      // {"data":{"type":"event","number":22,"key":"Mailbox/DispatchId","value":{"dispatch_id":{"id":"0x595af9a9099d27cf06dd01c65157287b9b2e338a9e1b9494ded72cc561fcea1d"}},"module":{"type":"moduleRef","name":"Mailbox"}},"meta":{}}
      if (dispatchEvent && dispatchIdEvent) {
        result.push({
          messageId: dispatchIdEvent.value['dispatch_id'] as Record<
            string,
            unknown
          >['id'] as HexString,
          destination: this.multiProvider.getChainName(
            dispatchEvent.value['dispatch'] as Record<
              string,
              unknown
            >['destination_domain'] as Domain,
          ),
        });
      }
    }
    return result;
  }
  waitForMessageProcessed(
    messageId: HexString,
    destination: ChainName,
    delayMs?: number,
    maxAttempts?: number,
  ): Promise<boolean> {
    throw new Error('Not implemented');
  }
}
