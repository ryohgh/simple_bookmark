export interface BookmarkBlock {
  type: string;
  name: string;
  pos: number[];
  children: BookmarkBlock[] | undefined;
  url: string|undefined;
}
