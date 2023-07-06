type Identity = {
  id: string;
  addr: string;
  domain: string;
  is_owner_main: Boolean;
  error?: string;
};

type AspectNftProps = {
  contract_address: string;
  token_id: string;
  name: string | null;
  description: string | null;
  token_uri: string | null;
  image_uri: string | null;
  image_blur_hash: string | null;
  image_url_copy: string | null;
  image_small_url_copy: string | null;
  image_medium_url_copy: string | null;
  animation_uri: string | null;
  external_uri: string;
  null;
  attributes: Attribute[];
  contract: any;
  owner: {
    account_address: string;
    quantity: string;
  };
  aspect_link: string;
};

type AspectApiResult = {
  assets: AspectNftProps[];
  next_url?: string;
  remainder?: AspectNftProps[];
};

export interface CityBuilded {
  tileId: number;
  flipX: boolean;
  flipY: boolean;
}
