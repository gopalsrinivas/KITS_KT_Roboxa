import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidationErrors, Form, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crocreate',
  templateUrl: './crocreate.component.html',
  styleUrls: ['./crocreate.component.css']
})
export class CROcreateComponent implements OnInit {
  myData: any;

  public isEdit: boolean = false;
  public id: any = '';
  getcroData: any;
  constructor(private admin: AdminService,
    private _activatedRoute: ActivatedRoute, private router: Router, private http:HttpClient
  ) {
    this._activatedRoute.params.subscribe((data: any) => {
      if (data.id) {
        this.isEdit = true;
        this.id = data.id;
        admin.getCrobyId(data.id).subscribe((data: any) => {
          this.getcroData = data
          this.CroForm.patchValue(data)
          this.CroForm.controls['cro_code'].disable()
          this.CroForm.controls['cro_name'].disable()
          this.CroForm.controls['legal_cro_name'].disable()
          this.CroForm.controls['email'].disable()

        });

      }
    });
    this.admin.country().subscribe((resp: any) => {
      console.log(resp)
      const countries = [];
      for (let i = 0; i < resp.length; ++i) {
          const country = resp[i];
          countries.push({ text: country.text, value: country.value });
      }
      this.myData = countries;
      console.log(countries)
  });
  }

  public CroForm: FormGroup = new FormGroup({
    cro_code: new FormControl("", [Validators.required]),
    cro_name: new FormControl("", [Validators.required]),
    legal_cro_name: new FormControl("", [Validators.required]),
    address_1: new FormControl("", [Validators.required]),
    address_2: new FormControl(""),
    address_3: new FormControl("",),
    address_4: new FormControl(""),
    city: new FormControl("", [Validators.required]),
    district: new FormControl("", [Validators.required]),
    region: new FormControl("", [Validators.required]),
    zip_code: new FormControl("", [Validators.required, Validators.min(100000), Validators.max(999999)]),
    country: new FormControl("", [Validators.required]),
    office_telephone: new FormControl(""),
    extension: new FormControl(""),
    email: new FormControl(''),
    website:new FormControl(''),
    mobile_telephone:new FormControl(''),
      // Validators.required,
      // Validators.email,
      // this.emailDomainValidator.bind(this)

    // website: new FormControl('', [
    //   Validators.required,
    //   Validators.minLength(3),
    //   Validators.pattern(
    //     /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    //   ) // Regular expression pattern for URL validation
    // ]),

    // mobile_telephone: new FormControl('', [
    //   Validators.required,
    //   Validators.pattern('[0-9]{10}')
    // ]),
  });

  emailDomainValidator(control: FormControl): ValidationErrors | null {
    const email = control.value;
    if (email && email.indexOf('@') !== -1) {
      const [_, domain] = email.split('@');
      if (!['gmail.com'].includes(domain)) {
        return { invalidDomain: true };
      }
    }
    return null; // Return null for valid email format
  }

  ngOnInit(): void {
   

  }


  shouldShowRequired(controlName: string): boolean {
    const control = this.CroForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched) || false;
  }

  shouldShowLengthError(controlName: any): boolean {

    const control = this.CroForm.get(controlName);
    return control?.invalid && (control?.errors?.['minlength'] || control?.errors?.['maxlength']) && (control?.dirty || control?.touched) || false;
  }
  shouldShowPatternError(controlName: string): boolean {
    const control = this.CroForm.get(controlName);
    return control?.touched && control?.errors?.['pattern'];
  }
  shouldShowUrlError(controlName: string): boolean {
    const control = this.CroForm.get(controlName);
    return !!control?.hasError('pattern') && !!control?.value && (control?.dirty || control?.touched);
  }

  submit() {
   console.log(this.CroForm.controls['mobile_telephone'].value.toString());
   
    
      if (this.CroForm.invalid) {
        // Mark all form controls as touched to trigger validation
        Object.keys(this.CroForm.controls).forEach(key => {
          this.CroForm.get(key)?.markAsTouched();
        });
        alert('please fill all Mandatory Fields')
      }
    else {
      const obj: any = {
        "cro_code": this.CroForm.controls['cro_code'].value,
        "cro_name": this.CroForm.controls['cro_name'].value,
        "legal_cro_name": this.CroForm.controls['legal_cro_name'].value,
        "address_1": this.CroForm.controls['address_1'].value,
        "address_2": this.CroForm.controls['address_2'].value,
        "address_3": this.CroForm.controls['address_3'].value,
        "address_4": this.CroForm.controls['address_4'].value,
        "city": this.CroForm.controls['city'].value,
        "district": this.CroForm.controls['district'].value,
        "region": this.CroForm.controls['region'].value,
        "zip_code": this.CroForm.controls['zip_code'].value,
        "country": this.CroForm.controls['country'].value,
        "office_telephone": this.CroForm.controls['office_telephone'].value,
        "mobile_telephone": this.CroForm.controls['mobile_telephone'].value.toString(),
        "extension": this.CroForm.controls['extension'].value,
        "email": this.CroForm.controls['email'].value,
        "website": this.CroForm.controls['website'].value
      }
      if (this.isEdit) {
        obj.cro_id = this.id
        this.admin.updateCroDetaild(obj).subscribe(
          (data: any) => {
            alert(' CRO Details updated successfully');
            this.router.navigate(['/home/admin/croGrid'])
          },
          (err: any) => {
            alert("server errorr")
          }
        );
      }
      else {
        this.admin.CreateCroDetails(obj).subscribe(
          (data: any) => {
            alert("CRO Details Created Successfully");
            this.router.navigate(['/home/admin/croGrid'])
          },
          (err: any) => {
            alert("err")
          }
        )
      }
    }
  }
}