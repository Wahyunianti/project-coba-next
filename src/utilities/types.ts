export type TenorPrice = {
  tenor: number | 0;
  total_dp: number | 0;
  angsuran: number | 0;
};

export type CarTenorType = {
  id: number;
  name: string | '';
  image: string | '';
  cars_image: CarImage[];
  cars_type: CarTypeWithTenor[];
};

export type CarImage = {
  id: number;
  image: string | '';
};

export type CarTypeWithTenor = {
  id: number;
  name: string | '';
  price: number | 0;
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

export type Testimonials = {
  id: number;
  name: string | '';
  image: string | '';
};

export type Settings = {
  id: number;
  whatsapp:number | 0;
  phone: number | 0;
  email: string | '';
  facebook: string | '';
  alamat: string | '';
};