async function correctEnum(obj: any) {
  for (const key in obj) {
    if (key === "enum") {
      obj["x-enumNames"] = [];
      for (let i = 0; i < obj[key].length; i++) {
        const idx = obj[key][i].indexOf(":");
        const front = obj[key][i].slice(0, idx);
        const back = obj[key][i].slice(idx + 1);
        obj[key][i] = front;
        obj["x-enumNames"].push(back);
      }
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      correctEnum(obj[key]);
    }
  }
  return obj;
}

const myObject = {
  innerObject1: {
    nestedObject11: {
      nestedObject111: {
        nestedObject1111: {
          enum: ["ALL:전체", "RETURN_ING:회수진행", "RETURN:회수완료", "ETC:기타"],
        },
      },
    },
  },
  innerObject2: {
    nestedObject22: {
      nestedObject222: {
        enum: ["ALL:전체", "RETURN_ING:회수진행", "RETURN:회수완료", "ETC:기타"],
      },
    },
  },
};
async function main() {
  const myObject2 = await correctEnum(myObject);
  console.log(JSON.stringify(myObject2, null, 2));
}

main();
/*
const { writeFileSync } = require("fs");

// P_TODO: 경로
const SWAGGER_JSON_URL =
  "https://treturnit.clinkers.io/v3/api-docs/3.%EC%95%B1";
const OUTPUT = `swagger-api-refined.json`;

const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

const main = async () => {
  const refined = await fetch(SWAGGER_JSON_URL)
    .then((res) => res.json())
    .then((data) => {
      const updated = { ...data };

      Object.entries(updated.paths).forEach(([path, value]) => {
        Object.entries(value).forEach(([method, value]) => {
          const updatedTags = value.tags.filter((tag) => !korean.test(tag));
          updated.paths[path][method].tags = updatedTags;
        });
      });

      return updated;
    });
  writeFileSync(OUTPUT, JSON.stringify(refined, null, 2));
};

main();

*/
