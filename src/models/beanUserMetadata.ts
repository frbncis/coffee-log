export default class BeanUserMetadata {
  id: string | undefined = undefined;

  beanId: string;

  userId: string;

  isLiked = false;

  constructor(beanId: string, userId: string) {
    this.beanId = beanId;
    this.userId = userId;
  }
}
