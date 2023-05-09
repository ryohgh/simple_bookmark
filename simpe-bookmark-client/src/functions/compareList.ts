export default function compareList(list1: any[], list2: any[]): boolean {
  const result =
    list1.length === list2.length &&
    list1.every((value, index) => value === list2[index]);
  return result;
}
