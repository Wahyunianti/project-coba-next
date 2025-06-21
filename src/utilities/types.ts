export type TenorPrice = {
  tenor: number;
  total_dp: number;
  angsuran: number;
};

export type CarTypeWithTenor = {
  id: number;
  name: string;
  price: number;
  tenor_price: TenorPrice[];
};

export type UploadResult = {
  publicUrl: string;
  filePath: string;
};

export type CarTenor = {
  cars_type_id: number;
  tenor: number;
  total_dp: number;
  angsuran: number;
};

export type CarDetail = {
  name: string;
  image: string;
  cars_type: CarType[]
};

export type CarType = {
  name: string;
  price: number;
};
