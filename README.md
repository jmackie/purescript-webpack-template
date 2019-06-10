# PureScript + Webpack project template 🚀

Having written configurations like this so many times, and having forgotten how
to do it almost every time, I thought I should finally create a reference for
myself (particularly now that we have [GitHub templates][github-templates-announcement] 🎉)

The style is a bit opinionated (#sorrynotsorry) but generally adheres to best
practices as I understand them. Feedback and suggestions are twelcome.

## Versions

- [Webpack][webpack] 4.x
- [Babel][babel] 7.x
- [PureScript][purescript] 0.13.x

### PureScript tooling

I'm not a fan of managing purescript tooling (`purs`, `psc-package`,
`spago`...) with Node, and hence these things aren't listed in `package.json`.
In order to work out of the box you should have `purs` and `psc-package` available 
somewhere on your `$PATH`.

In most cases it should be enough to grab a binary from the relevant releases
page (see [purescript releases][purs-releases] and [psc-package releases][psc-package-releases]) and
put it in a `bin` folder somewhere\*. For non-trivial projects you'll probably
want to use something more robust (e.g. Nix; [shameless plug][purescript-nix]).

**\* Good boy scout: pipe the tarball to `shasum` and make sure it matches the
relavant `.sha` file on the releases page.**

## Notes

- All the `*rc` files apart from `.babelrc` are optional. Delete them if you want.
- For most apps you'll probably want webpack configs for production and
  development environments. With this setup that should hopefully be trivial
  to do.
- [`css-modules`](https://github.com/css-modules/css-modules) are cool, I strongly 
  recommend them. And webpack's `css-loader` supports them out the box.
- I've used React (specifically, [`react-basic-hooks`][react-basic-hooks]), but
  that's just for the sake of example. Swap it out for whatever you want.
- PureScript's local (offline) documentation is great - run
  `purs docs --format html ".psc-package/*/*/*/src/**/*.purs"` then point your
  browser at `./generated-docs/html/index.html` 👌

## Useful References

- [Webpack configuration docs](https://webpack.js.org/configuration/)
- [Webpack build performance docs](https://webpack.js.org/guides/build-performance/)
- [Webpack caching docs](https://webpack.js.org/guides/caching/)
- [Front End Checklist](https://github.com/thedaviddias/Front-End-Checklist)

[webpack]: https://webpack.js.org/
[github-templates-announcement]: https://github.blog/2019-06-06-generate-new-repositories-with-repository-templates/
[purs-releases]: https://github.com/purescript/purescript/releases
[psc-package-releases]: https://github.com/purescript/psc-package/releases
[purescript]: http://www.purescript.org/
[babel]: https://babeljs.io/
[purescript-nix]: https://github.com/jmackie/purescript-nix
[react-basic-hooks]: https://github.com/spicydonuts/purescript-react-basic-hooks
