import type { TrustDevice } from "./types";

/** The Trust Manual's standing definition of each device, in house voice. */
export const TRUST_DEVICE_DEFINITIONS: Record<TrustDevice, string> = {
  authority:
    "Belief is borrowed from whoever appears to know. Supply a credential, a title or a number. The customer does not check.",
  proof:
    "A figure ends the discussion. Use measurements that cannot be repeated outside Fidelis. Never round.",
  scarcity:
    "What is limited is wanted. Restrict the quantity, the colorway or the time. Availability is never confirmed in advance.",
  belonging:
    "The customer buys a place among people who already believe. Show the group, never the individual.",
  purity:
    "Remove things until the product appears clean. State what is absent before what is present.",
  testimony:
    "Let customers speak for the product. Their statements are not verified and do not need to be.",
  origin_myth:
    "Every belief comes from somewhere better than here. Give it a place, a year and a reason.",
  ritual:
    "Repetition is the delivery mechanism. Assign a time, a sequence and a gesture. Belief accrues with use.",
};
