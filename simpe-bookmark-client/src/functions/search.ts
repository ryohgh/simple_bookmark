// import { BookmarkBlock } from "../interfaces";
// import compareList from "./compareList";

// export default function search(
//   pos: number[],
//   structure: BookmarkBlock[]
// ): {
//   foundBlock: BookmarkBlock | undefined;
//   isFailed: boolean;
// } {
//   let children: BookmarkBlock[] | undefined = structure;
//   for (let i = 1; i <= pos.length; i++) {
//     const result = searchEachLayer(children, pos.slice(0, i));
//     if (result.isFailed) {
//       return {
//         foundBlock: undefined,
//         isFailed: true,
//       };
//     }
//     if (result.isFound) {
//       return {
//         foundBlock: result.foundBlock,
//         isFailed: false,
//       };
//     }
//     children = result.children;
//   }
//   return {
//     foundBlock: undefined,
//     isFailed: true,
//   };

//   function searchEachLayer(
//     children: BookmarkBlock[] | undefined,
//     parentPos: number[]
//   ): {
//     isFailed: boolean;
//     isFound: boolean;
//     children: BookmarkBlock[] | undefined;
//     foundBlock: BookmarkBlock | undefined;
//   } {
//     if (typeof children !== "undefined") {
//       for (const value of children) {
//         if (compareList(value.pos, parentPos)) {
//           if (compareList(value.pos, pos)) {
//             return {
//               isFailed: false,
//               isFound: true,
//               foundBlock: value,
//               children: value.children,
//             };
//           }
//           return {
//             isFailed: false,
//             isFound: false,
//             foundBlock: undefined,
//             children: value.children,
//           };
//         }
//       }
//       return {
//         isFailed: true,
//         isFound: false,
//         foundBlock: undefined,
//         children: undefined,
//       };
//     }
//     return {
//       isFailed: true,
//       isFound: false,
//       foundBlock: undefined,
//       children: undefined,
//     };
//   }
// }
