import { v4 as uuid, v4 } from "uuid";
import { CompetitionCriteria } from "../types/BK_Competition/Criterion";
import { CompetitionSubmission } from "../types/BK_Competition/Submission";

interface DeleteOperationReturnType {
  resultArr: CompetitionCriteria[];
  itemExist: boolean;
}
export const handleAdd = (
  arr: CompetitionCriteria[],
  crit: CompetitionCriteria,
  parentId: number
): boolean => {
  if (arr.length === 0) return false;
  let found = false;
  for (var item of arr) {
    if (item.id === parentId) {
      item.children = [...item.children, crit];
      item.standardPoint += crit.standardPoint;
      return true;
    } else {
      found = handleAdd(item.children, crit, parentId);
      if (found === true) return true;
    }
  }
  return found;
};
export const isNameExist = (
  name: string,
  arr: CompetitionCriteria[]
): boolean => {
  if (arr.length === 0) return false;
  let found = false;
  for (var item of arr) {
    if (item.name === name) {
      return true;
    } else {
      found = isNameExist(name, item.children);
      if (found === true) return true;
    }
  }
  return found;
};
export const handleDelete = (
  arr: CompetitionCriteria[],
  id: string | number
): DeleteOperationReturnType => {
  if (arr.length === 0) return { resultArr: [], itemExist: false };
  for (var item of arr) {
    if (item.id === id) {
      return { resultArr: arr.filter((ele) => ele.id !== id), itemExist: true };
    } else {
      const result = handleDelete(item.children, id);
      if (result.itemExist === true) {
        item.children = result.resultArr;
        item.soft = item.soft - 1 >= 0 ? item.soft - 1 : item.soft;
      }
    }
  }
  return { resultArr: arr, itemExist: false };
};

export const handleModify = (
  arr: CompetitionCriteria[],
  crit: CompetitionCriteria,
  parentId: number
): boolean => {
  //console.log(arr.length);
  if (arr.length === 0) return false;
  if (parentId === 0) {
    for (const item of arr) {
      if (item.id === crit.id) {
        let indexOfItem = arr.indexOf(item);
        arr[indexOfItem] = crit;
        return true;
      }
    }
    return false;
  }
  for (const item of arr) {
    if (item.id === parentId) {
      for (var subItem of item.children) {
        if (subItem.id === crit.id) {
          let indexOfItem = item.children.indexOf(subItem);
          item.children[indexOfItem] = crit;
          return true;
        }
      }
    } else {
      var found = handleModify(item.children, crit, parentId);
      if (found === true) return found;
    }
  }
  return false;
};

export const handleUpdateSoft = (
  arr: CompetitionCriteria[],
  critId: string | number,
  soft: number
): boolean => {
  if (arr.length === 0) return false;
  for (var item of arr) {
    if (item.id === critId) {
      let indexOfItem = arr.indexOf(item);
      arr[indexOfItem] = { ...item, soft: soft };
      return true;
    } else {
      var found = handleUpdateSoft(item.children, critId, soft);
      if (found === true) return found;
    }
  }
  return false;
};

//Application part
export const GenerateApplicationHandler = (
  arr: CompetitionCriteria[],
  userId: number,
  comId: number
): CompetitionSubmission[] => {
  if (arr.length === 0) return [];
  var result: CompetitionSubmission[] = [];
  for (var item of arr) {
    const id = uuid();
    const sub: CompetitionSubmission = {
      id: id,
      userId: userId,
      competitionId: comId,
      criteriaID: item.id,
      file: "",
      point: 0,
      description: "",
      studentComment: "",
    };
    var subsOfChild = GenerateChild(item.children, userId, comId);
    if (subsOfChild.length > 0) {
      result = [...result, sub].concat(subsOfChild);
    } else {
      result = [...result, sub];
    }
  }
  return result;
};

const GenerateChild = (
  arr: CompetitionCriteria[],
  userId: number,
  comId: number
): CompetitionSubmission[] => {
  if (arr.length === 0) return [];
  var result: CompetitionSubmission[] = [];
  for (var item of arr) {
    const id = uuid();
    const sub: CompetitionSubmission = {
      id: id,
      userId: userId,
      competitionId: comId,
      criteriaID: item.id,
      file: "",
      point: 0,
      description: "",
      studentComment: "",
    };
    result = [...result, sub];
  }
  return result;
};
export const handleApplicationPointChange = (
  arr: CompetitionSubmission[],
  subId: string | number,
  point: number
): boolean => {
  if (arr.length === 0) return false;
  for (var item of arr) {
    if (item.id === subId) {
      let indexOfItem = arr.indexOf(item);
      arr[indexOfItem] = { ...item, point: point };
      return true;
    }
  }
  return false;
};
// export const handleApplicationBinaryChange = (
//   arr: CompetitionSubmission[],
//   subId: string | number,
//   bin: boolean
// ): boolean => {
//   if (arr.length === 0) return false;
//   for (var item of arr) {
//     if (item.id === subId) {
//       let indexOfItem = arr.indexOf(item);
//       arr[indexOfItem] = { ...item, binary: bin };
//       return true;
//     }
//   }
//   return false;
// };
export const handleApplicationStudentCommentChange = (
  arr: CompetitionSubmission[],
  subId: string | number,
  studentComment: string
): boolean => {
  if (arr.length === 0) return false;
  for (var item of arr) {
    if (item.id === subId) {
      let indexOfItem = arr.indexOf(item);
      arr[indexOfItem] = { ...item, studentComment: studentComment };
      return true;
    }
  }
  return false;
};

// export const handleApplicationStudentSelectChange = (
//   arr: CompetitionSubmission[],
//   subId: string | number,
//   studentSelect: string
// ): boolean => {
//   //console.log("Hanle student select change with value:", studentSelect);
//   if (arr.length === 0) return false;
//   for (var item of arr) {
//     if (item.id === subId) {
//       let indexOfItem = arr.indexOf(item);
//       arr[indexOfItem] = { ...item, studentSelect: studentSelect };
//       return true;
//     }
//   }
//   return false;
// };

export const handleApplicationFileChange = (
  arr: CompetitionSubmission[],
  subId: string | number,
  file: string
): boolean => {
  if (arr.length === 0) return false;
  for (var item of arr) {
    if (item.id === subId) {
      let indexOfItem = arr.indexOf(item);
      arr[indexOfItem] = { ...item, file: file };
      return true;
    }
  }
  return false;
};

export const DoiTrangThayDen = (
  arr: CompetitionCriteria[],
  newId: number
): boolean => {
  //Dung de thay doi id cua tieu chi luc clone de khi gui len no khong bi trung
  if (arr.length === 0) return true;
  for (let item of arr) {
    item.id = v4();

    const result = DoiTrangThayDen(item.children, newId);
  }
  return false;
};
