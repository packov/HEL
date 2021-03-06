/**
 * 这个包主要用来查询 目录 文章列表 以及 文章信息
 * @type {[type]}
 */
var path = require("path"),
	debug = require("debug")("postInfoModel"),
	constVar = require(path.join(constVarPath)),
	dbBase = require(path.join(constVar.modelPath, "dbBase")),
	stateCode = require(path.join(constVar.configPath, "stateCode"));

var catalogModel = function() {};
var fn = catalogModel.prototype = new dbBase;

/**
 * 获取当前catalogSlug目录下第page页的文章数据,
 * @param  {[type]} catalogSlug [description]
 * @param  {[type]} page        [description]
 * @param  {[type]} perPage     [description]
 * @param  {[type]} func        [description]
 * @return {[type]}             [description]
 */
fn.getCatalogPost = function(catalogSlug, page, perPage, func) {

	var index = (page - 1) * perPage;
	index = index > 0 ? index : 0;
	//每页文章数

	perPage = parseInt(perPage) || 10;
	var catalogSlugEscape = this.pool.escape(catalogSlug);
	//首先根据别名为slug的目录的基本信息
	var sql = "select * from meta where type='catalog' and slug=" + catalogSlugEscape + ";";
	//目录显得文章信息
	var sql2 = "select * from eassy where eid in " +
		"(select nid FROM relationships where type='postCatalog' and mid = " +
		"( select mid from meta where type='catalog' and slug=" + catalogSlugEscape + ")) " +
		"ORDER BY created desc limit " + this.pool.escape(index) + "," + this.pool.escape(perPage) + ";";

	this.query(sql + sql2, [], function(result) {
		var resObj = {
			postList: [],
			catalogInfo: {}
		};
		if (result.state === 200) {
			resObj.catalogInfo = result.opRes[0][0];
			resObj.postList = result.opRes[1];
		} else {
			debug("目录文章查询失败");
		}

		func(resObj);

	});
}

fn.getAllCatalogs=function(func){
	var sql="select * from meta where type='catalog' ;";
	this.query(sql,[],function(result){
		func(result);
	});
}

module.exports = exports = catalogModel;