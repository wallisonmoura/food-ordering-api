export class ImageUrl {
  constructor(private readonly url: string) {
    if (!url.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/)) {
      throw new Error('Invalid image URL');
    }
  }

  getValue(): string {
    return this.url;
  }
}
