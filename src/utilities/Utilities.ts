class Utilities {
  private formatter: Intl.NumberFormat;

  constructor() {
    this.formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });
  }

  formatRupiah(amount: number): string {
    return this.formatter.format(amount);
  }
}

export default Utilities;
