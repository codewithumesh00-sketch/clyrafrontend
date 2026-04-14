import Template1, { template1Meta } from './template1';
import Template2, { template2Meta } from './template2';
import Template3, { template3Meta } from './template3';
import Template4, { template4Meta } from './template4';
import Template5, { template5Meta } from './template5';
import Template6, { template6Meta } from './template6';
import Template7, { template7Meta } from './template7';
import Template8, { template8Meta } from './template8';
import Template9, { template9Meta } from './template9';
import Template10, { template10Meta } from './template10';
import Template11, { template11Meta } from './template11';
import Template12, { template12Meta } from './template12';
import Template13, { template13Meta } from './template13';
import Template14, { template14Meta } from './template14';
import Template15, { template15Meta } from './template15';
import Template16, { template16Meta } from './template16';
import Template17, { template17Meta } from './template17';
import Template18, { template18Meta } from './template18';
import Template19, { template19Meta } from './template19';
import Template20, { template20Meta } from './template20';
import Template21, { template21Meta } from './template21';
import Template22, { template22Meta } from './template22';
import Template23, { template23Meta } from './template23';
import Template24, { template24Meta } from './template24';
import Template25, { template25Meta } from './template25';
import Template26, { template26Meta } from './template26';
import Template27, { template27Meta } from './template27';
import Template28, { template28Meta } from './template28';
import Template29, { template29Meta } from './template29';
import Template30, { template30Meta } from './template30';
import Template31, { template31Meta } from './template31';
import Template32, { template32Meta } from './template32';
import Template33, { template33Meta } from './template33';
import Template34, { template34Meta } from './template34';
import Template35, { template35Meta } from './template35';
import Template36, { template36Meta } from './template36';
import Template37, { template37Meta } from './template37';
import Template38, { template38Meta } from './template38';
import Template39, { template39Meta } from './template39';
import Template40, { template40Meta } from './template40';

export const templateRegistry = {
  'business/template1': { component: Template1, meta: template1Meta },
  'business/template2': { component: Template2, meta: template2Meta },
  'business/template3': { component: Template3, meta: template3Meta },
  'business/template4': { component: Template4, meta: template4Meta },
  'business/template5': { component: Template5, meta: template5Meta },
  'business/template6': { component: Template6, meta: template6Meta },
  'business/template7': { component: Template7, meta: template7Meta },
  'business/template8': { component: Template8, meta: template8Meta },
  'business/template9': { component: Template9, meta: template9Meta },
  'business/template10': { component: Template10, meta: template10Meta },
  'business/template11': { component: Template11, meta: template11Meta },
  'business/template12': { component: Template12, meta: template12Meta },
  'business/template13': { component: Template13, meta: template13Meta },
  'business/template14': { component: Template14, meta: template14Meta },
  'business/template15': { component: Template15, meta: template15Meta },
  'business/template16': { component: Template16, meta: template16Meta },
  'business/template17': { component: Template17, meta: template17Meta },
  'business/template18': { component: Template18, meta: template18Meta },
  'business/template19': { component: Template19, meta: template19Meta },
  'business/template20': { component: Template20, meta: template20Meta },
  'business/template21': { component: Template21, meta: template21Meta },
  'business/template22': { component: Template22, meta: template22Meta },
  'business/template23': { component: Template23, meta: template23Meta },
  'business/template24': { component: Template24, meta: template24Meta },
  'business/template25': { component: Template25, meta: template25Meta },
  'business/template26': { component: Template26, meta: template26Meta },
  'business/template27': { component: Template27, meta: template27Meta },
  'business/template28': { component: Template28, meta: template28Meta },
  'business/template29': { component: Template29, meta: template29Meta },
  'business/template30': { component: Template30, meta: template30Meta },
  'business/template31': { component: Template31, meta: template31Meta },
  'business/template32': { component: Template32, meta: template32Meta },
  'business/template33': { component: Template33, meta: template33Meta },
  'business/template34': { component: Template34, meta: template34Meta },
  'business/template35': { component: Template35, meta: template35Meta },
  'business/template36': { component: Template36, meta: template36Meta },
  'business/template37': { component: Template37, meta: template37Meta },
  'business/template38': { component: Template38, meta: template38Meta },
  'business/template39': { component: Template39, meta: template39Meta },
  'business/template40': { component: Template40, meta: template40Meta },
};

export function resolveTemplate(id: string) {
  return (
    templateRegistry[
      id as keyof typeof templateRegistry
    ] ||
    templateRegistry[
      `business/${id}` as keyof typeof templateRegistry
    ]
  );
}