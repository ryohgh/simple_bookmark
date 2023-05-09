export interface BookmarkBlock {
  block_type: string;
  block_name: string;
  block_pos: number[];
  block_children: BookmarkBlock[] | undefined;
  block_url: string|undefined;
}
