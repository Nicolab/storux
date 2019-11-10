module.exports = function(api) {
	api.cache(true);

	return {
		presets: [
			[
				'@babel/preset-env',
				{
          // useBuiltIns: 'usage',
          // corejs: 3,
					// loose: true,
					exclude: ['@babel/plugin-transform-typeof-symbol'],
					targets: {
						browsers: ['last 2 versions', 'IE >= 11']
					}
				}
			]
		],
		plugins: [
      '@babel/plugin-transform-runtime',
      // '@babel/plugin-transform-modules-commonjs',
      // '@babel/plugin-syntax-dynamic-import',

      // // '@babel/plugin-proposal-export-default-from',
      // '@babel/plugin-proposal-logical-assignment-operators',
      // ['@babel/plugin-proposal-optional-chaining', { loose: false }],
      // ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
      // ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: false }],
      // '@babel/plugin-proposal-do-expressions',

      // // '@babel/plugin-proposal-numeric-separator',
      // '@babel/plugin-proposal-object-rest-spread',
      // 'babel-plugin-transform-async-to-promises',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      // '@babel/plugin-proposal-export-namespace-from',
      // '@babel/plugin-proposal-throw-expressions',
    ],
    retainLines: true,
    comments: false,
    sourceMaps: true,
		ignore: ['./dist']
	};
};