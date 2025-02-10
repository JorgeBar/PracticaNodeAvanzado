import {I18n} from "i18n";
import  path from 'node:path'
import * as utils from './utils.js'


const i18n = new I18n({
    locales: ['en', 'es'],
    directory: path.join(utils.__dirname, '..', 'locales'),
    defaultLocale: 'en',
    autoReload: true, // watch for changes in JSON files to reload locate on updates - defaults to false
    syncFiles: true, //sync locale information across al files -defaults to false
    cookie: 'nodepop-locale',
})

export default i18n