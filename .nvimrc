au BufRead .babelrc set filetype=json
au BufRead .eslintrc set filetype=json
au BufRead .prettierrc set filetype=json

let g:ale_linters = {
\   'javascript': ['eslint'],
\}
let g:ale_fixers = {
\   '*': ['remove_trailing_lines', 'trim_whitespace'],
\   'javascript': ['prettier'],
\   'json': ['prettier'],
\   'css': ['prettier'],
\   'markdown': ['prettier'],
\}
