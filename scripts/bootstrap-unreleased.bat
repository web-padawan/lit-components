@ECHO OFF
SETLOCAL

SET NPM_BIN=
FOR /F "tokens=*" %%i in ('CALL npm bin') DO SET NPM_BIN=%%i

CALL %NPM_BIN%\lerna bootstrap --hoist
CALL %NPM_BIN%\lerna clean --yes

IF NOT EXIST "%CD%\node_modules\@lit" MKDIR "%CD%\node_modules\@lit"

FORFILES /P packages /M * /C "CMD /C MKLINK /J %CD%\node_modules\@lit\@file %CD%\packages\@file"
