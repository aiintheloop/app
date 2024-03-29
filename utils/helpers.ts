import { Price } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/utils/supabase-client';

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'https://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

export const generateNewApiKey = async (id :string) => {
  const newApiKey = uuidv4();
  const { data, error } = await supabase
    .from('users')
    .update({ api_key: newApiKey })
    .eq('id', id);
  return newApiKey;
};

export const getApiKey = async (id :string) => {
  const { data, error } = await supabase
    .from('users')
    .select('api_key')
    .eq('id', id);
  return data;
};

export const hasDuplicateIdentifiers = (data: Array<Record<string, string>> | null | undefined): boolean => {
  if(data == undefined) {
    return false
  }
  const identifierSet = new Set<string>();
  return data.some(item => identifierSet.has(item.identifier) || !identifierSet.add(item.identifier));
}

export const postData = async ({
  url,
  data
}: {
  url: string;
  data?: { price: Price };
}) => {
  console.log('posting,', url, data);

  const res: Response = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    console.log('Error in postData', { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const getCurrentDate = () => {
  return new Date().toISOString();
};

export const generateUUID = () => {
  return uuidv4();
};

export const capitalizeFirstLetter = (word: string) => {
  var splitStr = word.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
};

export const isValidHttpUrl = (string: string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
};
