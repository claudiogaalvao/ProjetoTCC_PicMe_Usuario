export default interface DeviceModel {
  deviceId?: string;
  brand?: string;
  model?: string;
  type?: string;
  priceMin?: number;
  qtdMin?: number;
  createdAt?: Date;
  active?:boolean;
}