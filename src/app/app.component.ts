import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { CalculatorService } from './calculator.service';
import { PropertyCode } from './calculator/common/enums';
import { Properties } from './properties';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  subscription: Subscription = new Subscription();
  debounceTime = 500;

  paramsFormGroup: FormGroup;
  //properties: Properties;
  properties: Record<PropertyCode, any>;

  constructor(private fb: FormBuilder, private calculator: CalculatorService) {
    //this.properties = new Properties();
    const initialProperties = new Properties();
    this.properties = Object.assign({}, ... Object.keys(initialProperties).map(x => ({ [x]: initialProperties[x] })));
    this.paramsFormGroup = this.fb.group(this.properties);
  }

  ngOnInit(): void {
    this.functionToBeCalled();
    this.subscription.add(
      this.paramsFormGroup.valueChanges
        .pipe(debounceTime(this.debounceTime))
        .subscribe(() => {
          this.functionToBeCalled();
        })
    );
  }

  getControlLabel(type: string) {
    console.log(this.paramsFormGroup && this.paramsFormGroup.controls, type);
    if (
      this.paramsFormGroup &&
      this.paramsFormGroup.controls &&
      this.paramsFormGroup.controls[type]
    ) {
      return this.paramsFormGroup.controls[type].value;
    }
    return 0;
  }

  async functionToBeCalled() {    
    let props = this.paramsFormGroup.value;
    this.properties = await this.calculator.calculate(props);
    this.paramsFormGroup.patchValue(this.properties);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
