// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  seleniumAddress: 'http://selenium:4444/wd/hub',
  specs: [
    './src/spec/front/*.e2e-spec.ts'
  ],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        '--disable-web-security',
        '--headless', '--disable-gpu',
        '--no-sandbox'
      ]
    }

},
  baseUrl: 'http://front:4200',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    jasmine.getEnv().addReporter({
      specStarted(result) {
        jasmine.getEnv().currentSpec = result;
      },
      specDone() {
        jasmine.getEnv().currentSpec = null;
      }
    })
  }
};
