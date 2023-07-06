export const getIdentityData = async (id: number) => {
  const response = await fetch(
    `https://${
      process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? `goerli.` : ``
    }app.starknet.id/api/indexer/id_to_data?id=${id}`
  );
  return response.json();
};
