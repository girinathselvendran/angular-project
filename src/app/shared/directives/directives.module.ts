import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumericDirective } from './numeric-only/numeric.directive';
import { UppercaseDirective } from './uppercase/uppercase.directive';
import { AlphanumericDirective } from './alphanumeric/alphanumeric.directive';
import { AlphabetDirective } from './alphabets/alphabets.directive';
import { AlphabetNumberAndSpaceDirective } from './alphabetsandspace/alphabetsNumberandSpace.directive';
import { AlphanumericspecialDirective } from './alphabetsnumberspecial/alphabetsnumberspecial.directive';
import { NumericcolonDirective } from './numericcolon/numericcolon.directive';
import { PreventDoubleClickDirective } from './preventDoubleClick/preventDoubleClick.directive';
import { AlphaNumericDecimalDirective } from './alphaNumericDecimal/alphaNumericDecimal';
import { AlphaNumericHypenUnderscore } from './alphanumerichypenunderscore/alphanumerichypenunderscore.directive';
import { AlphaNumericDecimalSpaceDirective } from './alphaNumericDecimalSpace/alphaNumericDecimalSpace';
import { SpaceAtFirstDirective } from './spaceatfirst/spaceatfirst.directive';
import { NumericFullStopDirective } from './numericandFullStop/numeric-full-stop.directive';
import { NumericHyphenDirective } from './numericHyphen/numeric-hyphenchar.directive';
import { NumericHyphenandFullStopDirective } from './numericHyphenandFullStop/numeric-hyphenand-full-stop.directive';
import { NumericHyphensDirective } from './numericHyphens/numeric-hyphens.directive';
import { SpaceAfterAlphabetDirective } from './spaceAfterAlphabet/spaceAfterAlphabet.directive';
import { AlphabetHyphenDirective } from './alphabethyphen/alphabethyphen.directive';
import { TrimSpaceAtFirstDirective } from './spaceatfirst/trim-space-at-first.directive';
import { AlphabetSlashDirective } from './alphabetSlash/alphabetSlash.directive';
import { MaximizeScreenDirective } from './maximizeScreen/macimizeScreen.directive';
import { AlphanumSpecialCharsExHyphenDirective } from './alphanumSpecialCharsExHyphen/alphanum-special-chars-ex-hyphen.directive';
import { NumericAndDecimalDirective } from './numericAndDecimal/NumericAndDecimal';

@NgModule({
  declarations: [PreventDoubleClickDirective, NumericDirective, UppercaseDirective, SpaceAfterAlphabetDirective, AlphanumericDirective, AlphaNumericHypenUnderscore, AlphabetDirective, AlphabetNumberAndSpaceDirective, AlphaNumericDecimalDirective, AlphanumericspecialDirective, NumericcolonDirective, AlphaNumericDecimalSpaceDirective, SpaceAtFirstDirective, NumericFullStopDirective, NumericHyphenDirective, NumericHyphenandFullStopDirective, NumericHyphensDirective, AlphabetHyphenDirective, TrimSpaceAtFirstDirective, AlphabetSlashDirective, MaximizeScreenDirective, AlphanumSpecialCharsExHyphenDirective, NumericAndDecimalDirective],
  imports: [
    CommonModule
  ],
  exports: [PreventDoubleClickDirective, NumericDirective, UppercaseDirective, AlphanumericDirective, SpaceAfterAlphabetDirective, AlphaNumericHypenUnderscore, AlphabetDirective, AlphabetNumberAndSpaceDirective, AlphaNumericDecimalDirective, AlphanumericspecialDirective, NumericcolonDirective, AlphaNumericDecimalSpaceDirective, SpaceAtFirstDirective, NumericFullStopDirective, NumericHyphenDirective, NumericHyphenandFullStopDirective, NumericHyphensDirective, AlphabetHyphenDirective, NumericAndDecimalDirective,
    TrimSpaceAtFirstDirective, AlphabetSlashDirective, MaximizeScreenDirective, AlphanumSpecialCharsExHyphenDirective]
})
export class DirectivesModule { }
