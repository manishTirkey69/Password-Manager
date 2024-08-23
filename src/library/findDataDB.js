const { Model } = require("./mongoose");

async function searchByUserId(substring) {
  try {
    if (substring.length === 0) return [];
    const results = await Model.find(
      {
        $or: [
          { url: new RegExp(substring, "i") },
          { userId: new RegExp(substring, "i") },
        ],
      },

      //   returns only _id and userId
      {
        _id: 1,
        url: 1,
        userId: 1,
      }
    );

    return results.map((res) => ({
      id: res._id.toString(),
      url: res.url,
      userId: res.userId,
    }));
  } catch (error) {
    console.error("Error finding users:", error);
    return [];
  }
}

async function searchPassById(Id) {
  Id = Id.trim();
  const result = await Model.findOne({ _id: Id });

  if (result) {
    return {
      id: result._id.toString(),
      url: result.url,
      userId: result.userId,
      password: result.password,
    };
  } else {
    console.error("Error finding users:", error);
    return null;
  }
}

module.exports.searchUserId = searchByUserId;
module.exports.searchPassword = searchPassById;
