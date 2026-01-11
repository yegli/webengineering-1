export default class ListMap extends Map {
  getValueList(key) {
    let valueList = this.get(key);
    if (!valueList) {
      valueList = [];
      this.set(key, valueList);
    }
    return valueList;
  }

  addToValueList(key, value) {
    const valueList = this.getValueList(key);
    valueList.push(value);
  }

  removeFromValueList(key, value) {
    const valueList = this.getValueList(key);
    this.set(key, valueList.filter((element) => element !== value));
  }
}
