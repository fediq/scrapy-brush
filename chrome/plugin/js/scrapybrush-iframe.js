var ScrapyBrushController = function ($scope, $http) {

    $scope.typeId = '';
    $scope.objectSelector = '';
    $scope.fields = [];
    $scope.urls = [];
    $scope.startUrls = '';

    $scope.resultSchema = '';

    $scope.activeTab = 'initial';
    $scope.fileToImport = null;

    // General buttons

    $scope.togglePosition = function () {
        $scope.pushEvent("togglePosition");
    };

    $scope.disable = function () {
        $scope.pushEvent("disable");
    };

    // Fields

    $scope.addField = function () {
        this.fields.push({
            name: '',
            selector: '',
            multiple: false,
            kind: 'text',
            attribute: ''
        });
    };

    $scope.removeField = function (field) {
        var index = this.fields.indexOf(field);
        this.fields.splice(index, 1);
    };

    $scope.showFieldSelection = function (selector) {
        $scope.showSelection($scope.objectSelector + ' ' + selector)
    };

    // Urls

    $scope.addUrl = function() {
        this.urls.push({
            selector: '',
            typeId: '',
            kind: 'attr',
            attribute: 'href'
        });
    };

    $scope.removeUrl = function (url) {
        var index = this.urls.indexOf(url);
        this.urls.splice(index, 1);
    };

    // Selectors

    $scope.showSelection = function (selector) {
        $scope.pushCommand("showSelection", selector);
    };

    $scope.hideSelection = function() {
        $scope.pushEvent("hideSelection");
    };

    // Results

    $scope.refreshSchema = function () {
        $scope.resultSchema = angular.toJson({
            typeId: $scope.typeId,
            objectSelector: $scope.objectSelector,
            startUrls: $scope.startUrls.split('\n'),
            fields: $scope.fields,
            urls: $scope.urls
        }, 2);

        var downloadAnchor = document.getElementById("downloadSchema");
        downloadAnchor.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURI($scope.resultSchema));
        downloadAnchor.setAttribute('download', $scope.typeId + ".json");
    };

    $scope.importNewSchema = function () {
        var fileInputElement = document.getElementById("importSchemaInput");
        console.log(fileInputElement);
        var fileInputFiles = fileInputElement.files;
        console.log(fileInputFiles);
        if (fileInputFiles.length === 0) {
            return;
        }

        var fileInput = fileInputFiles[0];
        console.log(fileInput);

        var reader = new FileReader();
        reader.onload = function () {
            var content = reader.result;
            console.log(content);

            var newSchema = angular.fromJson(content);
            console.log(newSchema);

            $scope.typeId = newSchema.typeId;
            $scope.objectSelector = newSchema.objectSelector;
            $scope.startUrls = newSchema.startUrls.join("\n");
            $scope.fields = newSchema.fields;
            $scope.urls = newSchema.urls;

            fileInputElement.files = new FileList();

            $scope.refreshSchema();
        };
        reader.readAsText(fileInput);
    };

    // Messaging with parent

    $scope.pushEvent = function(name) {
        $scope.pushCommand(name, []);
    };

    $scope.pushCommand = function(name, args) {
        parent.postMessage(['scrapybrush_supervisor_' + name].concat(args), '*');
    };

    // Listeners

    document.getElementById('importSchemaInput').addEventListener('change', function(e) {
        var fileInputElement = document.getElementById("importSchemaInput");
        console.log(fileInputElement);
        var fileInputFiles = fileInputElement.files;
        console.log(fileInputFiles);
        if (fileInputFiles.length === 0) {
            return;
        }

        var fileInput = fileInputFiles[0];
        console.log(fileInput);

        var reader = new FileReader();
        reader.onload = function () {
            var content = reader.result;
            console.log(content);

            var newSchema = angular.fromJson(content);
            console.log(newSchema);

            $scope.typeId = newSchema.typeId;
            $scope.objectSelector = newSchema.objectSelector;
            $scope.startUrls = newSchema.startUrls.join("\n");
            $scope.fields = newSchema.fields;
            $scope.urls = newSchema.urls;

            fileInputElement.files = null;

            $scope.refreshSchema();
            angular.$digest()
        };
        reader.readAsText(fileInput);
    });

    window.addEventListener('message', function (e) {
        var methodParts = e.data[0].split('scrapybrush_iframe_');
        if (methodParts[0] === '') {
            e.data.splice(0, 1);
            $scope[methodParts[1]].apply($scope, e.data);
        }
    });
};
