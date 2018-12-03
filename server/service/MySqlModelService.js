import Utility from "../common/Utility";

export default class MySqlModelService {

  constructor(model) {
    this.model = model;
    this.FieldMap = {};
    this.WhereMap = {};
    this.DisplayMap = {};
  }

  AddField(name, value) {
    this.FieldMap[name] = value;
    return this;
  }

  AddWhereField(name, value) {
    this.WhereMap[name] = value;
  }

  AddDisplayField(name) {
    this.DisplayMap[name] = name;
  }

  async BuildSqlSentence(SqlType = Utility.BuildSqlSentenceType.Query) {

  }
  async Add() { }
  async Delete() { }
  async Update() { }
  async Query() { }
  async QueryOneByStr(condition) {
    const { model, DisplayMap } = this;
    let _limit = 'limit 0,1';
    let sql = `select * from ${model} where `;
  }
}