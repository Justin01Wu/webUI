
/* 
 * This library define ChapterPageNavigator
 * it depends on VCache if settings.cacheKey is set
 * it query API on every chapter if it is not queried
 * For usage details please see  ChapterPageNavigatorSpec.js
 * 
 * by Justin Wu
 */

if (!window.console) {
    window.console = {
        log: function () {
        },
        warn: function () {
        },
        error: function () {
        }
    };
}


(function (window) {
    'use strict';


    function ChapterPageNavigator(settings) {
        this.init();
        this.pageSize = 25;
        this.pagePerChapter = 20;   // one chapter has 20 pages
        this.queryCallBack = null;  // loading data query call back
        this.hasMore = null;  // if database has more records

        if (settings) {
        	
        	if (typeof settings.cacheKey !== 'undefined') {
        		var cacheObj = VCache.get(settings.cacheKey);  
        		if(cacheObj){
        			console.log("create ChapterPageNavigator from cache...");
        			var objectCopy = JSON.parse(cacheObj);
        			this.clone(objectCopy);
                    if (settings.queryCallBack){
                        if (typeof settings.queryCallBack === 'function') {
                            this.queryCallBack = settings.queryCallBack;
                        }else{
                            throw new Error("queryCallBack is not a function");
                        }                
                    }
        			return;
        		}
        	}
        	
            if (settings.queryCallBack){
                if (typeof settings.queryCallBack === 'function') {
                    this.queryCallBack = settings.queryCallBack;
                }else{
                    throw new Error("queryCallBack is not a function");
                }                
            }
            if (settings.pageSize) {
                this.pageSize = settings.pageSize;
            }
            if (typeof settings.pagePerChapter !== 'undefined') {   
                this.pagePerChapter = settings.pagePerChapter;
            }
            if (typeof settings.cacheKey !== 'undefined') {   
                this.cacheKey = settings.cacheKey;
            }             
        }
    }

    ChapterPageNavigator.prototype.init = function () {

        this.totalChapterAmount = 0;
        this.totalPageAmount = 0;
        this.currentChapter = 0;

        this.allRows = null;  // hold all query result
        this.pageRows = null;  //  hold current page rows
        //this.hasMore = null;  // if database has more records

        this.currentPage = 1;
        //this.pagePerChapter = 20;   // one chapter has 20 pages
        this.pageStartOnCurrentChapter = 0;  // page start number on the current chapter	
        this.pageEndOnCurrentChapter = 0;  // page end number on the current chapter
        
        this.loading = false;  // if page is loading data

        //this.pageSize = 25;
        // this.cacheKey = null;

        //this.queryCallBack = null;  // loading data query call back
        this.cleanOldData = false;  // inner variable to tell if need to clean old data
        this.fromCache = false;  // true if this object is cloned from the cache

    };
    
    ChapterPageNavigator.prototype.clone = function (orig) {
        this.init();
        
        this.fromCache = true;
        this.pageSize = orig.pageSize;
        this.pagePerChapter = orig.pagePerChapter;   
        // this.queryCallBack = null;  // can't copy function 
        this.hasMore = orig.hasMore;  
        this.totalChapterAmount = orig.totalChapterAmount;
        this.totalPageAmount = orig.totalPageAmount;;
        this.currentChapter = orig.currentChapter;
        this.currentPage = orig.currentPage;
        this.allRows = orig.allRows;  
        this.pageRows = orig.pageRows;        
        this.pageStartOnCurrentChapter = orig.pageStartOnCurrentChapter;  // page start number on the current chapter	
        this.pageEndOnCurrentChapter = orig.pageEndOnCurrentChapter;  // page end number on the current chapter
        
        this.loading = orig.loading;

         this.cacheKey = orig.cacheKey;

        this.cleanOldData = orig.cleanOldData;  // inner variable to tell if need to clean old data
    }


    ChapterPageNavigator.prototype._clean = function () {
        this.init();
        this.allRows = null;
        this.pageRows = null;

    };


    ChapterPageNavigator.prototype.loadData = function (queryResult, hasMoreField, dataListField) {

        this.loading = false;
        var hasMoreFieldName = hasMoreField? hasMoreField: "more";
        var dataListFieldName = dataListField? dataListField: "dataList";        

        if(!queryResult[dataListFieldName] || !(queryResult[dataListFieldName] instanceof Array)){
        	throw new Error("query result doesn't have target field:" + dataListFieldName );
        }
        if (typeof queryResult[hasMoreFieldName] === 'undefined') {       	
        	throw new Error("query result doesn't have target field:" + hasMoreFieldName );
        }        
        
        console.log("got " + queryResult[dataListFieldName].length + " records");
        var hasMore = queryResult[hasMoreFieldName];
        if (hasMore) {
            var rowPerChapter = this.pageSize * this.pagePerChapter;
            if (queryResult[dataListFieldName].length < rowPerChapter) {
                throw new Error("query didn't return full data and it said it has more data");
            }
        }

        this.currentChapter++;
        if (this.allRows) {
            this.allRows = this.allRows.concat(queryResult[dataListFieldName]);
        } else {
            this.allRows = queryResult[dataListFieldName];
        }

        this.hasMore = hasMore;

        var recalculateCurrentPage = true;
        this._setupPage(recalculateCurrentPage);

    };

    ChapterPageNavigator.prototype.isCurrentPage = function (pageIndex) {
        if (pageIndex === this.currentPage) {
            return true;
        }
        return false;
    };


    ChapterPageNavigator.prototype._setupPage = function (recalculateCurrentPage) {

        // calculate chapter amount
        var rowPerChapter = this.pageSize * this.pagePerChapter;
        this.totalPageAmount = Math.ceil(this.allRows.length / this.pageSize);
        this.totalChapterAmount = Math.ceil(this.allRows.length / rowPerChapter);
        var segStartRow = rowPerChapter * (this.currentChapter - 1);
        var segEndRow = rowPerChapter * (this.currentChapter);

        this.pageStartOnCurrentChapter = this.pagePerChapter * (this.currentChapter - 1);
        this.pageEndOnCurrentChapter = this.pagePerChapter * this.currentChapter;
        if(this.pageEndOnCurrentChapter > this.totalPageAmount){
        	this.pageEndOnCurrentChapter = this.totalPageAmount
        }
        
        if(recalculateCurrentPage){
        	this.currentPage = this.pageStartOnCurrentChapter + 1;
        }
        
        this.gotoPage(this.currentPage);
    };

    ChapterPageNavigator.prototype.hasNextChapter = function () {
        if (!this.allRows) {
            return false;
        }
        var rowPerChapter = this.pageSize * this.pagePerChapter;
        this.totalChapterAmount = Math.ceil(this.allRows.length / rowPerChapter);

        if (this.currentChapter < this.totalChapterAmount) {
            return true;
        }
        if (this.hasMore) {
            return true;
        }
        return false;
    };

    ChapterPageNavigator.prototype.gotoPage = function (pageIndex) {

        console.log("goto page " + pageIndex);
        if(this.loading){
        	console.log("can't goto page when data is loading " );
        	return;
        }
        var start = (pageIndex - 1) * this.pageSize;
        this.pageRows = this.allRows.slice(start, start + this.pageSize);
        this.currentPage = pageIndex;
        
        if(this.cacheKey){
        	
//        	var cacheObj = new ChapterPageNavigator();
//        	cacheObj.clone(this);
//        	VCache.put(cacheObj, 600, this.cacheKey);   //   cache 10 minutes
//        	console.log("saved ChapterPageNavigator" );
        	
        	
        	// IE doesn't support save object into different framevery well 
        	//  it will throw this error : Can't execute code from a freed script
        	// so change to this following behaviour: serialize it
        	var cacheObj = JSON.stringify(this);  
        	VCache.put(cacheObj, 600, this.cacheKey);   //   cache 10 minutes
        	console.log("saved ChapterPageNavigator" );

        }

    };

    ChapterPageNavigator.prototype.search = function (cleanOldData) {

        console.log("getting records for next chapter...");
        if(this.loading){
        	console.log("can't do another search when data is loading " );
        	return;
        }
        if (cleanOldData) {
            this._clean();
        }
        var startRow = 1;
        if (this.allRows) {
            startRow = this.allRows.length + 1;
        }
        var rowPerChapter = this.pageSize * this.pagePerChapter;
        this.loading = true;
        this.queryCallBack(startRow, rowPerChapter);

    };

    ChapterPageNavigator.prototype.hasPreviousChapter = function () {

        if (this.currentChapter <= 1) {
            return false;
        }
        return true;
    };

    ChapterPageNavigator.prototype.gotoPreviousChapter = function () {
        if(this.loading){
        	console.log("can't goto previous chapter when data is loading " );
        	return;
        }
        var rowPerChapter = this.pageSize * this.pagePerChapter;
        this.totalChapterAmount = Math.ceil(this.allRows.length / rowPerChapter);

        if (this.currentChapter === 1) {
            console.error("can't goto previous chapter");
            return;
        }
        this.currentChapter--;
        
        var recalculateCurrentPage = true;
        this._setupPage(recalculateCurrentPage);

    };

    ChapterPageNavigator.prototype.gotoNextChapter = function () {
        if(this.loading){
        	console.log("can't goto next chapter when data is loading " );
        	return;
        }
        var rowPerChapter = this.pageSize * this.pagePerChapter;
        this.totalChapterAmount = Math.ceil(this.allRows.length / rowPerChapter);

        if (this.currentChapter > this.totalChapterAmount) {
            console.error("can't goto next chapter");
            return;
        }

        var totalExpectedRows = (this.currentChapter + 1) * rowPerChapter;
        if (totalExpectedRows > this.allRows.length) {
            var cleanOldData = false;
            this.search(cleanOldData);
        } else {
            this.currentChapter++;
            var recalculateCurrentPage = true;
            this._setupPage(recalculateCurrentPage);
        }

    };

    ChapterPageNavigator.prototype.setPageSize = function (newValue) {
        if(this.loading){
        	console.log("can't set page size when data is loading " );
        	return;
        }
        if (newValue === this.pageSize) {
            return;
        }
        var oldValue = this.pageSize;
        this.pageSize = newValue;

        console.log("pageSize changed from " + this.pageSize + " to " + newValue);

        //  recalculate page position when user set different row per page:			  
        //	    (1) remember the current page start row (from the allRows)
        //		(2) recalculation chapter amount, if last chapter is not full, then discard rows of last chapter, chapter amount minus 1--

        //	  get current page start row (from the allRows)
        var previousRow = (this.currentPage - 1) * oldValue + 1;

        // calculate chapter amount
        var rowPerChapter = newValue * this.pagePerChapter;
        this.totalChapterAmount = Math.ceil(this.allRows.length / rowPerChapter);
        if (this.totalChapterAmount === 0 && this.hasMore === true) {
            // first chapter is not full, so clean all data and re-query
            console.log("first chapter is not full, so clean all data and re-query");
            this.search(true);
            return;
        }


        // recalculate chapter amount if page size is changed

        while (rowPerChapter * this.totalChapterAmount > this.allRows.length) {
            // if last chapter is not full, then discard rows of last chapter, chapter amount minus 1--
            if (this.totalChapterAmount > 0) {
                this.totalChapterAmount--;
                this.hasMore = true;
            } else {
                // TODO: if first chapter page is not full
                break;
            }

        }
        if (this.totalChapterAmount === 0) {
            console.log("first chapter is not full, so clean all data and re-query");
            this.search(true);
            return;
        }
        
        this.totalPageAmount = this.totalChapterAmount *  this.pagePerChapter;

        // remove extra rows to align chapter
        if (rowPerChapter * this.totalChapterAmount < this.allRows.length) {
            this.allRows = this.allRows.slice(0, rowPerChapter * this.totalChapterAmount);
            this.hasMore = true;
        }

        if (previousRow > this.allRows.length) {

            console.log("previous row is discarded, so use last page ");
            this.currentPage = this.totalPageAmount;
            this.currentChapter = this.totalChapterAmount;
            //return;
        } else {
            this.currentPage = Math.ceil(previousRow / this.pageSize);
            this.currentChapter = Math.ceil(previousRow / rowPerChapter);
        }
        var recalculateCurrentPage = false;
        this._setupPage(recalculateCurrentPage);
        //this.pageStartOnCurrentChapter = this.pagePerChapter * (this.currentChapter - 1);
        //this.gotoPage(this.currentPage);

    };


    window.ChapterPageNavigator = ChapterPageNavigator;



})(window);

