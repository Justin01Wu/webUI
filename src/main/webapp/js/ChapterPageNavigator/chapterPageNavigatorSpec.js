describe('test chapterPageNavigator.js', function () {


    	it("test init values of new chapterPageNavigator", function () {
    		
            var chapterPageNavigator = new ChapterPageNavigator();
            expect(chapterPageNavigator.totalChapterAmount).toEqual(0);
            expect(chapterPageNavigator.totalPageAmount).toEqual(0);            
            expect(chapterPageNavigator.currentPage).toEqual(1);
            expect(chapterPageNavigator.currentChapter).toEqual(0);
            expect(chapterPageNavigator.hasPreviousChapter()).toEqual(false);
            expect(chapterPageNavigator.allRows).toEqual(null);
            expect(chapterPageNavigator.pageRows).toEqual(null);
            expect(chapterPageNavigator.pageStartOnCurrentChapter).toEqual(0);
            expect(chapterPageNavigator.pageEndOnCurrentChapter).toEqual(0);
            expect(chapterPageNavigator.pageSize).toEqual(25);            
            expect(chapterPageNavigator.loading).toEqual(false);
            expect(chapterPageNavigator.hasMore).toEqual(null);    
            expect(chapterPageNavigator.hasNextChapter()).toEqual(false);
            expect(chapterPageNavigator.fromCache).toEqual(false);
            
            
            	
        });
    	
    	it("test queryCallBack is not a function, chapterPageNavigator should throw error", function () {
    		
            var settings = {
                    queryCallBack: "a string"	
            };    		
            expect( function(){ 
            	var chapterPageNavigator = new ChapterPageNavigator(settings);
            }).toThrow(new Error("queryCallBack is not a function"));            
            	
        });
    	
    	it("test queryCallBack didn't pass correct dataList field name", function () {
    		
            var settings = {
                    queryCallBack: mySearch	
            };  		
            
            var chapterPageNavigator = new ChapterPageNavigator(settings);            
            expect( function(){ 
            	chapterPageNavigator.search(true);
            }).toThrow();           
            return;
            
            function mySearch(startRow, rowPerChapter){
            	
            	expect(startRow).toEqual(1);
            	expect(rowPerChapter).toEqual(500);            	
            	// mock query result
            	var dataList = [];
            	for(var i=0; i<rowPerChapter-30; i++){
            		dataList.push("string" + (i+1));
            	}
            	var queryResult = {
            			more : false,
            			accountList : dataList
            	};
            	expect(chapterPageNavigator.loading).toEqual(true);
            	chapterPageNavigator.loadData(queryResult);
            	expect(chapterPageNavigator.hasMore).toEqual(false);
            }
            	
        });            
    	
    	it("test load first not full chapter", function () {
    		
            var settings = {
                    queryCallBack: mySearch	
            };
    		
            var chapterPageNavigator = new ChapterPageNavigator(settings);
            
            chapterPageNavigator.search(true);
            
            expect(chapterPageNavigator.currentPage).toEqual(1);
            expect(chapterPageNavigator.totalChapterAmount).toEqual(1);
            expect(chapterPageNavigator.totalPageAmount).toEqual(19);  //  mock data give only 470 rows
            expect(chapterPageNavigator.currentChapter).toEqual(1);
            expect(chapterPageNavigator.hasPreviousChapter()).toEqual(false);            
            expect(chapterPageNavigator.allRows.length).toEqual(470);
            expect(chapterPageNavigator.pageRows.length).toEqual(25);  // first page is full
            expect(chapterPageNavigator.pageStartOnCurrentChapter).toEqual(0);
            expect(chapterPageNavigator.pageEndOnCurrentChapter).toEqual(19);
            expect(chapterPageNavigator.pageSize).toEqual(25);
            expect(chapterPageNavigator.loading).toEqual(false);
            expect(chapterPageNavigator.hasMore).toEqual(false);           
            expect(chapterPageNavigator.isCurrentPage(1)).toEqual(true);
            expect(chapterPageNavigator.isCurrentPage(2)).toEqual(false);
            expect(chapterPageNavigator.hasNextChapter()).toEqual(false);
            expect(chapterPageNavigator.fromCache).toEqual(false);
            
            return;
            
            function mySearch(startRow, rowPerChapter){
            	
            	expect(startRow).toEqual(1);
            	expect(rowPerChapter).toEqual(500);            	
            	// mock query result
            	var dataList = [];
            	for(var i=0; i<rowPerChapter-30; i++){
            		dataList.push("string" + (i+1));
            	}
            	var queryResult = {
            			more2 : false,
            			accountList2 : dataList
            	};
            	expect(chapterPageNavigator.loading).toEqual(true);
            	chapterPageNavigator.loadData(queryResult, "more2", "accountList2");
            	expect(chapterPageNavigator.hasMore).toEqual(false);
            }
            	
        });
    	
    	it("test reset page size to bigger, second chapter is not full", function () {
    		
            var settings = {
            		pageSize: 5,
                    queryCallBack: mySearch	
            };
    		
            var chapterPageNavigator = new ChapterPageNavigator(settings);
            
            chapterPageNavigator.search(true);
            expect(chapterPageNavigator.hasMore).toEqual(true);
            
            chapterPageNavigator.setPageSize(10);
            
            expect(chapterPageNavigator.currentPage).toEqual(1);
            expect(chapterPageNavigator.totalChapterAmount).toEqual(1);
            expect(chapterPageNavigator.totalPageAmount).toEqual(14);  //  mock data give 134 rows  ceil(134/10)  = 14 
            expect(chapterPageNavigator.currentChapter).toEqual(1);
            expect(chapterPageNavigator.hasPreviousChapter()).toEqual(false);            
            expect(chapterPageNavigator.allRows.length).toEqual(134);  // 10 row per page * 20 pages
            expect(chapterPageNavigator.pageRows.length).toEqual(10);
            expect(chapterPageNavigator.pageStartOnCurrentChapter).toEqual(0);
            expect(chapterPageNavigator.pageEndOnCurrentChapter).toEqual(14);
            expect(chapterPageNavigator.pageSize).toEqual(10);
            expect(chapterPageNavigator.loading).toEqual(false);
            expect(chapterPageNavigator.hasMore).toEqual(false);           
            expect(chapterPageNavigator.isCurrentPage(1)).toEqual(true);
            expect(chapterPageNavigator.isCurrentPage(2)).toEqual(false);
            expect(chapterPageNavigator.hasNextChapter()).toEqual(false);

            return;
            
            
            function mySearch(startRow, rowPerChapter){
            	
            	var oldRowPerChapter = 5*20;   // 5 row per page * 20 pages
            	expect(startRow).toEqual(1);            	
  
            	var dataList = [];
            	var returnRows =  rowPerChapter;
            	var hasMore =  true;
            	if(rowPerChapter > oldRowPerChapter){
            		returnRows = 134;
            		hasMore =  false;
            	}
            	for(var i=0; i< returnRows; i++){
            		dataList.push("string" + (startRow + i));
            	}
            	
              	var queryResult = {
            			more : hasMore,
            			dataList : dataList
            	};
            	expect(chapterPageNavigator.loading).toEqual(true);
            	chapterPageNavigator.loadData(queryResult);
            	if(rowPerChapter > oldRowPerChapter){
            		expect(chapterPageNavigator.hasMore).toEqual(false);
            	}else{
            		expect(chapterPageNavigator.hasMore).toEqual(true);	
            	}
            	
            }
            	
        });
    	
    	it("test reset page size to smaller with no more data", function () {
    		
            var settings = {
                    queryCallBack: mySearch	
            };
    		
            var chapterPageNavigator = new ChapterPageNavigator(settings);
            
            chapterPageNavigator.search(true);
            
            var newPageSize = 10;
            
            chapterPageNavigator.setPageSize(newPageSize);
            
            expect(chapterPageNavigator.currentPage).toEqual(1);
            expect(chapterPageNavigator.totalChapterAmount).toEqual(2);  // allrows =  25*20 = 500, now 500/(10*20) = 2 ..50, the third chapter is not full, so it is discard
            expect(chapterPageNavigator.totalPageAmount).toEqual(40);  //  chapter align to 400,  ceil(400/10)  = 40
            expect(chapterPageNavigator.currentChapter).toEqual(1);
            expect(chapterPageNavigator.hasPreviousChapter()).toEqual(false);            
            expect(chapterPageNavigator.allRows.length).toEqual(400);  
            expect(chapterPageNavigator.pageRows.length).toEqual(newPageSize);
            expect(chapterPageNavigator.pageStartOnCurrentChapter).toEqual(0);
            expect(chapterPageNavigator.pageEndOnCurrentChapter).toEqual(20);
            expect(chapterPageNavigator.pageSize).toEqual(newPageSize);
            expect(chapterPageNavigator.loading).toEqual(false);
            expect(chapterPageNavigator.hasMore).toEqual(true);           
            expect(chapterPageNavigator.isCurrentPage(1)).toEqual(true);
            expect(chapterPageNavigator.isCurrentPage(2)).toEqual(false);
            expect(chapterPageNavigator.hasNextChapter()).toEqual(true);
            expect(chapterPageNavigator.fromCache).toEqual(false);
            
            return;
            
            function mySearch(startRow, rowPerChapter){
            	
            	//expect(startRow).toEqual(1);
            	//expect(rowPerChapter).toEqual(500);
            	// mock query result
            	
            	var hasMore =  false;
            		
            	var dataList = [];
            	for(var i=0; i<rowPerChapter; i++){
            		dataList.push("string" + (i+1));
            	}
            	var queryResult = {
            			more : hasMore,
            			dataList : dataList
            	};
            	//expect(chapterPageNavigator.loading).toEqual(true);
            	chapterPageNavigator.loadData(queryResult);
            	//expect(chapterPageNavigator.hasMore).toEqual(false);
            }
            	
        });    	
    	
    	it("test goto page", function () {
    		
            var settings = {
            		pageSize: 10,
                    queryCallBack: mySearch	
            };
    		
            var chapterPageNavigator = new ChapterPageNavigator(settings);
            
            chapterPageNavigator.search(true);            
           
            chapterPageNavigator.gotoPage(19);
            
            expect(chapterPageNavigator.currentPage).toEqual(19);
            expect(chapterPageNavigator.totalChapterAmount).toEqual(1);     
            expect(chapterPageNavigator.totalPageAmount).toEqual(20);  
            expect(chapterPageNavigator.currentChapter).toEqual(1);
            expect(chapterPageNavigator.hasPreviousChapter()).toEqual(false);            
            expect(chapterPageNavigator.allRows.length).toEqual(200);  
            expect(chapterPageNavigator.pageRows.length).toEqual(10);
            expect(chapterPageNavigator.pageStartOnCurrentChapter).toEqual(0);
            expect(chapterPageNavigator.pageEndOnCurrentChapter).toEqual(20);
            expect(chapterPageNavigator.pageSize).toEqual(10);
            expect(chapterPageNavigator.loading).toEqual(false);
            expect(chapterPageNavigator.hasMore).toEqual(true);           
            expect(chapterPageNavigator.isCurrentPage(19)).toEqual(true);
            expect(chapterPageNavigator.isCurrentPage(2)).toEqual(false);
            expect(chapterPageNavigator.hasNextChapter()).toEqual(true);
            expect(chapterPageNavigator.fromCache).toEqual(false);
            
            return;
            
            function mySearch(startRow, rowPerChapter){
            	
            	expect(startRow).toEqual(1);
            	expect(rowPerChapter).toEqual(200);
            	// mock query result
            	
            	var hasMore =  true;
            		
            	var dataList = [];
            	for(var i=0; i<rowPerChapter; i++){
            		dataList.push("string" + (i+1));
            	}
            	var queryResult = {
            			more : hasMore,
            			dataList : dataList
            	};
            	expect(chapterPageNavigator.loading).toEqual(true);
            	chapterPageNavigator.loadData(queryResult);
            	expect(chapterPageNavigator.hasMore).toEqual(true);
            }
            	
        });       	
    	
    	it("test navigator can remember its status if it has cacheKey", function () {
    		
            var settings = {
            		cacheKey : window.location.pathname + "#navigator45",
            		pageSize: 10,
                    queryCallBack: mySearch	
            };
    		
            var chapterPageNavigatorOld = new ChapterPageNavigator(settings);
            
            chapterPageNavigatorOld.search(true);            
           
            chapterPageNavigatorOld.gotoPage(19);
            
            var chapterPageNavigator = new ChapterPageNavigator(settings);  // this new chapterPageNavigator will copy everything from old chapterPageNavigator
            
            expect(chapterPageNavigator.fromCache).toEqual(true);
            
            expect(chapterPageNavigator.currentPage).toEqual(19);
            expect(chapterPageNavigator.totalChapterAmount).toEqual(1);     
            expect(chapterPageNavigator.totalPageAmount).toEqual(20);  
            expect(chapterPageNavigator.currentChapter).toEqual(1);
            expect(chapterPageNavigator.hasPreviousChapter()).toEqual(false);            
            expect(chapterPageNavigator.allRows.length).toEqual(200);  
            expect(chapterPageNavigator.pageRows.length).toEqual(10);
            expect(chapterPageNavigator.pageStartOnCurrentChapter).toEqual(0);
            expect(chapterPageNavigator.pageEndOnCurrentChapter).toEqual(20);
            expect(chapterPageNavigator.pageSize).toEqual(10);
            expect(chapterPageNavigator.loading).toEqual(false);
            expect(chapterPageNavigator.hasMore).toEqual(true);           
            expect(chapterPageNavigator.isCurrentPage(19)).toEqual(true);
            expect(chapterPageNavigator.isCurrentPage(2)).toEqual(false);
            expect(chapterPageNavigator.hasNextChapter()).toEqual(true);
            
            return;
            
            function mySearch(startRow, rowPerChapter){
            	
            	expect(startRow).toEqual(1);
            	expect(rowPerChapter).toEqual(200);
            	// mock query result
            	
            	var hasMore =  true;
            		
            	var dataList = [];
            	for(var i=0; i<rowPerChapter; i++){
            		dataList.push("string" + (i+1));
            	}
            	var queryResult = {
            			more : hasMore,
            			dataList : dataList
            	};
            	expect(chapterPageNavigatorOld.loading).toEqual(true);
            	chapterPageNavigatorOld.loadData(queryResult);
            	expect(chapterPageNavigatorOld.hasMore).toEqual(true);
            }
            	
        });       	
    	
    	it("test goto Next Chapter", function () {
    		
            var settings = {
            		pageSize: 10,
                    queryCallBack: mySearch	
            };
    		
            var chapterPageNavigator = new ChapterPageNavigator(settings);
            
            chapterPageNavigator.search(true);            
           
            chapterPageNavigator.gotoNextChapter();
            
            expect(chapterPageNavigator.currentPage).toEqual(21);
            expect(chapterPageNavigator.totalChapterAmount).toEqual(2);     
            expect(chapterPageNavigator.totalPageAmount).toEqual(40);  
            expect(chapterPageNavigator.currentChapter).toEqual(2);
            expect(chapterPageNavigator.hasPreviousChapter()).toEqual(true);            
            expect(chapterPageNavigator.allRows.length).toEqual(400);  
            expect(chapterPageNavigator.pageRows.length).toEqual(10);
            expect(chapterPageNavigator.pageStartOnCurrentChapter).toEqual(20);
            expect(chapterPageNavigator.pageEndOnCurrentChapter).toEqual(40);
            expect(chapterPageNavigator.pageSize).toEqual(10);
            expect(chapterPageNavigator.loading).toEqual(false);
            expect(chapterPageNavigator.hasMore).toEqual(true);           
            expect(chapterPageNavigator.isCurrentPage(21)).toEqual(true);
            expect(chapterPageNavigator.isCurrentPage(2)).toEqual(false);
            expect(chapterPageNavigator.hasNextChapter()).toEqual(true);
            expect(chapterPageNavigator.fromCache).toEqual(false);
            
            return;
            
            function mySearch(startRow, rowPerChapter){
            	
            	//expect(startRow).toEqual(1);
            	expect(rowPerChapter).toEqual(200);
            	// mock query result
            	
            	var hasMore =  true;
            		
            	var dataList = [];
            	for(var i=0; i<rowPerChapter; i++){
            		dataList.push("string" + (i+1));
            	}
            	var queryResult = {
            			more : hasMore,
            			dataList : dataList
            	};
            	expect(chapterPageNavigator.loading).toEqual(true);
            	chapterPageNavigator.loadData(queryResult);
            	expect(chapterPageNavigator.hasMore).toEqual(true);
            }
            	
        });      	
    	
    	it("test reset page size to smaller can remember old position", function () {
    		
            var settings = {
            		pageSize: 10,
                    queryCallBack: mySearch	
            };
    		
            var chapterPageNavigator = new ChapterPageNavigator(settings);
            
            chapterPageNavigator.search(true);            
           
            chapterPageNavigator.gotoPage(19);
            
            var newPageSize = 5;            
            chapterPageNavigator.setPageSize(newPageSize);
            
            expect(chapterPageNavigator.currentPage).toEqual(37); // why?
            expect(chapterPageNavigator.totalChapterAmount).toEqual(2);     
            expect(chapterPageNavigator.totalPageAmount).toEqual(40);  
            expect(chapterPageNavigator.currentChapter).toEqual(2);
            expect(chapterPageNavigator.hasPreviousChapter()).toEqual(true);            
            expect(chapterPageNavigator.allRows.length).toEqual(200);  
            expect(chapterPageNavigator.pageRows.length).toEqual(5);
            expect(chapterPageNavigator.pageStartOnCurrentChapter).toEqual(20);
            expect(chapterPageNavigator.pageEndOnCurrentChapter).toEqual(40);
            expect(chapterPageNavigator.pageSize).toEqual(5);
            expect(chapterPageNavigator.loading).toEqual(false);
            expect(chapterPageNavigator.hasMore).toEqual(true);           
            expect(chapterPageNavigator.isCurrentPage(37)).toEqual(true);
            expect(chapterPageNavigator.isCurrentPage(19)).toEqual(false);
            expect(chapterPageNavigator.hasNextChapter()).toEqual(true);
            expect(chapterPageNavigator.fromCache).toEqual(false);
            
            return;
            
            function mySearch(startRow, rowPerChapter){
            	
            	expect(startRow).toEqual(1);
            	expect(rowPerChapter).toEqual(200);
            	// mock query result
            	
            	var hasMore =  true;
            		
            	var dataList = [];
            	for(var i=0; i<rowPerChapter; i++){
            		dataList.push("string" + (i+1));
            	}
            	var queryResult = {
            			more : hasMore,
            			dataList : dataList
            	};
            	expect(chapterPageNavigator.loading).toEqual(true);
            	chapterPageNavigator.loadData(queryResult);
            	expect(chapterPageNavigator.hasMore).toEqual(true);
            }
            	
        });

    	it("test reset page size to smaller, cut last chapter data, hasMore change to true, page goto last page", function () {
    		
            var settings = {
            		pageSize: 9,
                    queryCallBack: mySearch	
            };
    		
            var chapterPageNavigator = new ChapterPageNavigator(settings);
            
            chapterPageNavigator.search(true);            
           
            chapterPageNavigator.gotoPage(20);
            
            var newPageSize = 4;            
            chapterPageNavigator.setPageSize(newPageSize);
            
            expect(chapterPageNavigator.currentPage).toEqual(40); // last chapter is not full, so cut it in order to align, page goto last page
            expect(chapterPageNavigator.totalChapterAmount).toEqual(2);     
            expect(chapterPageNavigator.totalPageAmount).toEqual(40);  
            expect(chapterPageNavigator.currentChapter).toEqual(2);
            expect(chapterPageNavigator.hasPreviousChapter()).toEqual(true);            
            expect(chapterPageNavigator.allRows.length).toEqual(160);  
            expect(chapterPageNavigator.pageRows.length).toEqual(4);
            expect(chapterPageNavigator.pageStartOnCurrentChapter).toEqual(20);
            expect(chapterPageNavigator.pageEndOnCurrentChapter).toEqual(40);
            expect(chapterPageNavigator.pageSize).toEqual(4);
            expect(chapterPageNavigator.loading).toEqual(false);
            expect(chapterPageNavigator.hasMore).toEqual(true);           
            expect(chapterPageNavigator.isCurrentPage(40)).toEqual(true);
            expect(chapterPageNavigator.isCurrentPage(20)).toEqual(false);
            expect(chapterPageNavigator.hasNextChapter()).toEqual(true);
            expect(chapterPageNavigator.fromCache).toEqual(false);
            
            return;
            
            function mySearch(startRow, rowPerChapter){
            	
            	expect(startRow).toEqual(1);
            	expect(rowPerChapter).toEqual(180);
            	// mock query result
            	
            	var hasMore =  false;
            		
            	var dataList = [];
            	for(var i=0; i<rowPerChapter; i++){
            		dataList.push("string" + (i+1));
            	}
            	var queryResult = {
            			more : hasMore,
            			dataList : dataList
            	};
            	expect(chapterPageNavigator.loading).toEqual(true);
            	chapterPageNavigator.loadData(queryResult);
            	expect(chapterPageNavigator.hasMore).toEqual(false);
            }
            	
        });
    	
    	

    	
    	it("test reset page size won't cut data, hasMore is still false", function () {
    		
            var settings = {
            		pageSize :10,
                    queryCallBack: mySearch	
            };
    		
            var chapterPageNavigator = new ChapterPageNavigator(settings);
            
            chapterPageNavigator.search(true);
            
            var newPageSize = 5;
            
            chapterPageNavigator.setPageSize(newPageSize);
            
            expect(chapterPageNavigator.currentPage).toEqual(1);
            expect(chapterPageNavigator.totalChapterAmount).toEqual(2);  // allrows =  10*20 = 200, now 200/(5*20) = 2 , no data is cut
            expect(chapterPageNavigator.totalPageAmount).toEqual(40);  
            expect(chapterPageNavigator.currentChapter).toEqual(1);
            expect(chapterPageNavigator.hasPreviousChapter()).toEqual(false);            
            expect(chapterPageNavigator.allRows.length).toEqual(200);  
            expect(chapterPageNavigator.pageRows.length).toEqual(newPageSize);
            expect(chapterPageNavigator.pageStartOnCurrentChapter).toEqual(0);
            expect(chapterPageNavigator.pageEndOnCurrentChapter).toEqual(20);
            expect(chapterPageNavigator.pageSize).toEqual(newPageSize);
            expect(chapterPageNavigator.loading).toEqual(false);
            expect(chapterPageNavigator.hasMore).toEqual(false);           
            expect(chapterPageNavigator.isCurrentPage(1)).toEqual(true);
            expect(chapterPageNavigator.isCurrentPage(2)).toEqual(false);
            expect(chapterPageNavigator.hasNextChapter()).toEqual(true);
            expect(chapterPageNavigator.fromCache).toEqual(false);
            
            return;
            
            function mySearch(startRow, rowPerChapter){
            	
            	expect(startRow).toEqual(1);
            	expect(rowPerChapter).toEqual(200);            	 
            	
            	var hasMore =  false;
            		
            	var dataList = [];
            	for(var i=0; i<rowPerChapter; i++){
            		dataList.push("string" + (i+1));
            	}
            	var queryResult = {
            			more : hasMore,
            			dataList : dataList
            	};
            	//expect(chapterPageNavigator.loading).toEqual(true);
            	chapterPageNavigator.loadData(queryResult);
            	//expect(chapterPageNavigator.hasMore).toEqual(false);
            }
            	
        });    
    	
    	it("test API return erorr data: more = true and query is not full of chapter size", function () {
    		
            var settings = {
                    queryCallBack: mySearch	
            };    		
            var chapterPageNavigator = new ChapterPageNavigator(settings);            
            expect( function(){ 
            	chapterPageNavigator.search(true);
            }).toThrow(new Error("query didn't return full data and it said it has more data"));     
                    
            
            return;
            
            function mySearch(startRow, rowPerChapter){
            	
            	expect(startRow).toEqual(1);
            	expect(rowPerChapter).toEqual(500);
            	
            	// mock query result            	
           		hasMore =  true;
            		
            	var dataList = [];
            	for(var i=0; i<rowPerChapter-1; i++){  // less than a chapter rows will throw error
            		dataList.push("string" + (i+1));
            	}
            	var queryResult = {
            			more : hasMore,
            			dataList : dataList
            	};
            	expect(chapterPageNavigator.loading).toEqual(true);
            	chapterPageNavigator.loadData(queryResult);
            	expect(chapterPageNavigator.hasMore).toEqual(false);
            }
            	
        });        	
    



});









