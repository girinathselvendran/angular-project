import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';
import { FormCanDeactivate } from 'src/app/core/guards/form-can-deactivate';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { StockMaintenanceService } from './service/stock-maintenance.service';
import { StockMaintenanceListComponent } from './stock-maintenance-list/stock-maintenance-list.component';

@Component({
  selector: 'app-stock-maintenance',
  templateUrl: './stock-maintenance.component.html',
})
export class StockMaintenanceComponent extends FormCanDeactivate {
  @ViewChild("stockMaintenanceList") stockMaintenanceList!: StockMaintenanceListComponent;
  @ViewChild("graphPopup") graphPopup: any;
  editSaveForm!: FormGroup;

  currentUserName: any;
  currentCompanyId: any;
  currentUserId: any;
  screenId: any;
  stockRecordCount: number = 0;
  stockSummaryRecordCount: number = 0;
  totalStockValue: number = 0;
  depotHQCurrency: string = "";

  associatedDepots = [];
  storeDDList = [];
  zoneDDList = [];
  binDDList = [];
  partTypeDDList = [];
  submittedSearch: boolean = false;
  isStockMaintenance: boolean = true;
  excelDataTable: any = [];
  estimateStatusOptions!: {};
  repairTypeStatsData!: { labels: string[]; datasets: { data: number[]; backgroundColor: string[]; hoverBackgroundColor: string[]; }[]; };
  partTypeData: {
    labels: string[]; datasets: {
      label?: string; data: number[]; backgroundColor: string[]; borderColor: string[];
    }[];
  } | undefined;
  partTypeOptions: any;
  storeGraphOptions!: any;
  storeGraphData: any = {};
  binGraphData: any;
  binGraphOptions: any = {};
  tableFilterFormGroup!: FormGroup;
  stockMaintenanceData: any = [];
  serverSideProcessing: any;
  totalDataGridCountComp: any;
  // bar chart
  zoneChartData: any = {};
  zoneChartOptions: any = {};

  zoneCountArray: any = [];
  binCountArray: any = [];
  zoneNameArray: any = [];
  zoneGraphFullData: any = [];
  binNameArray: any = [];
  zoneAndBinData!: any;
  selectedZoneGraphRecords: any;
  paramsGlobal: any;
  isBinAvailable: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    private datePipe: DatePipe,
    private loaderService: NgxUiLoaderService,
    private localeService: BsLocaleService,
    private router: Router,
    private stockMaintenanceService: StockMaintenanceService,
    private commonService: CommonService,
    private sharedTableStoreService: SharedTableStoreService,
    private notificationService: NotificationService,
    private excelService: ExcelService,
    private confirmationService: ConfirmationService
  ) {
    super();
    this.currentUserName = this.userAuthService.getCurrentUserName();
    this.currentCompanyId = this.userAuthService.getCurrentCompanyId();
    this.currentUserId = this.userAuthService.getCurrentUserId();
    enGbLocale.invalidDate = '';
    defineLocale('custom locale', enGbLocale);
    this.localeService.use('custom locale');
    const snapshot: RouterStateSnapshot = router.routerState.snapshot;
    this.screenId = snapshot.root.queryParams['screenId'];
  }


  data: any;

  options: any;

  ngOnInit() {
    this.editSaveForm = this.formBuilder.group({
      depot: [[], [Validators.required]],
      store: [[], []],
      zone: [[], []],
      bin: [[], []],
      partType: [[], []],
    });
    this.tableFilterFormGroup = this.formBuilder.group({
      store: ["", []],
      depot: ["", []],
      zoneName: ["", []],
      bin: ["", []],
      partType: ["", []],
      partName: ["", []],
      partCode: ["", []],
      partCategory: ["", []],
      availableStock: ["", []],
      stockUOM: ["", []],
      partSpecification: ["", []],
      totalAvailableStock: ["", []],
      partRate: ["", []],
      currency: ["", []],
      totalStockValue: ["", []],
      remarks: ["", []],
    });
    this.estimateStatusOptions = {
      tooltips: {
        callbacks: {
          label: function (tooltipItem: any, data: any) {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipLabel = data.labels[tooltipItem.index];
            const tooltipData = allData[tooltipItem.index];
            let total = 0;
            for (const i in allData) {
              if (allData[i]) {
                total += allData[i];
              }

            }
            const tooltipPercentage = parseFloat(((tooltipData / total) * 100).toString()).toFixed(2);
            return tooltipLabel + ': ' + tooltipPercentage + '%';
            // return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
          }
        }
      },
      plugins: {
        labels: false
      },
      legend: { display: false }
    };

    const estimationStatusLabels: any = [];
    const estimationStatusValues: any = [];


    this.repairTypeStatsData = {
      labels: estimationStatusLabels,
      datasets: [
        {

          data: (estimationStatusValues),
          backgroundColor: [
            "#ffa900",
            "#53d9a9",
            "#00a5a8",
            "#626e82",
            "#ff7d4d",
            "#ff4558",
            "#fecea8",
            "#549d11",
            "#e37b68"
          ],
          hoverBackgroundColor: [
            "#ffa900",
            "#53d9a9",
            "#00a5a8",
            "#626e82",
            "#ff7d4d",
            "#ff4558",
            "#fecea8",
            "#549d11",
            "#e37b68"
          ]
        }]
    };


    // Store Graph Data and options
    this.getStoreGraph();

    // Bar Chart
    // this.zoneChartData = {
    //   labels: ['store 1', 'store 2', 'store 3'],
    //   datasets: [
    //     {
    //       type: 'bar',
    //       label: ["zone1"],  // tool tip
    //       backgroundColor: "#ffa900",
    //       data: [50, 25, 12]
    //     },
    //     {
    //       type: 'bar',
    //       label: 'Dataset 2', // tool tip
    //       backgroundColor: "#626e82",
    //       data: [21, 84, 24]
    //     },
    //     {
    //       type: 'bar',
    //       label: 'Dataset 3',  // tool tip
    //       backgroundColor: "#549d11",
    //       data: [41, 52, 24]
    //     }
    //   ]
    // };

    // this.zoneChartOptions = {
    //   maintainAspectRatio: false,
    //   aspectRatio: 0.8,
    //   plugins: {
    //     tooltips: {
    //       mode: 'index',
    //       intersect: false
    //     },
    //     legend: {
    //       labels: false
    //     }
    //   },
    //   scales: {
    //     x: {
    //       stacked: true,
    //       ticks: {
    //         color: "ff4558"
    //       },
    //       grid: {
    //         color: "#73716f",
    //         drawBorder: false
    //       }
    //     },
    //     y: {
    //       stacked: true,
    //       ticks: {
    //         color: "ff4558"
    //       },
    //       grid: {
    //         color: "#73716f",
    //         drawBorder: false
    //       }
    //     }
    //   }
    // };





    // part type
    this.getPartTypeOptions();
    this.getActiveDepot();
    this.getPartType();
    this.getStockMaintenanceOverView();
  }

  // ------------------Common Functions Start------------------

  generateColors(colorsCount: number) {
    let colorsList = [];
    for (let index = 0; index < colorsCount; index++) {
      let color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
      colorsList.push(color);
    }
    console.log("colorsList", colorsList);
    return colorsList;
  }

  dropdownSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['code'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['code'].toLocaleLowerCase() === term ||
      item['description'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['description'].toLocaleLowerCase() === term
    );
  }

  checkNgSearchFormSelectValue(event: any, controlName: any) {
    const control = this.editSaveForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });
      this.editSaveForm.markAsDirty();
    } else {
      control.setErrors(null);
      if (controlName == "depot") {
        control.setErrors({ required: true })
      }
    }
  }

  get editSaveFormController() {
    return this.editSaveForm.controls;
  }

  resetForm() {
    this.editSaveForm.reset();
    this.searchRecordsList();
    this.storeDDList = [];
    this.zoneDDList = [];
    this.binDDList = [];
  }

  handleClosePopup() {
    this.graphPopup.hide();
    this.binGraphData = null;
    setTimeout(() => {
      this.isBinAvailable = false;
    }, 1000);
  }
  handleShowPopup() {
    this.graphPopup.show();
  }

  // -----------------------Common Functions End--------------------

  getStockMaintenanceOverView() {
    this.stockMaintenanceService
      .getStockMaintenanceOverView(this.currentUserId)
      .subscribe((res) => {
        if (res.status === true) {
          this.stockRecordCount = res.response.stockRecordCount;
          this.stockSummaryRecordCount = res.response.stockSummaryRecordCount;
          this.depotHQCurrency = res.response.depotHQCurrency;
          this.totalStockValue = res.response.totalStockValue;
        }
      });
  }

  // graph API start
  getStoreGraph() {
    const formValues = this.editSaveForm.getRawValue();

    const searchParams = {
      searchDepot: formValues?.depot?.map((depot: { depotId: any }) => depot?.depotId) ?? [],
      searchStore: formValues?.store?.map((store: { storeId: any }) => store?.storeId) ?? [],
      searchZone: formValues?.zone?.map((zone: { storeZoneDetailId: any }) => zone?.storeZoneDetailId) ?? [],
      searchBin: formValues?.bin?.map((bin: { storeBinDetailId: any }) => bin?.storeBinDetailId) ?? [],
      searchPartType: formValues?.partType?.map((partType: { partTypeId: any }) => partType?.partTypeId) ?? [],
      isStockSummary: this.isStockMaintenance,
    }


    this.stockMaintenanceService.getStoreGraph(searchParams, this.currentCompanyId, this.currentUserId)
      .subscribe((res) => {
        if (res.status === true) {

          let storeData = res.response.store;
          let partTypeData = res.response.partType;
          // let zoneAndBinData = res.response.zoneAndBin.zoneDetails;
          this.zoneAndBinData = ["zoneAndBinData"];

          let storeZoneBinDetails = res.response.zoneAndBin.storeZoneBinDetails
          let storeZoneBinDetailCount = res.response.zoneAndBin.storeZoneBinDetailCount
          let storeZoneDetailNames = res.response.zoneAndBin.storeZoneDetailNames


          console.log("storeData", storeData);
          this.zoneCountArray = [];
          this.zoneNameArray = [];
          this.zoneGraphFullData = [];
          this.binCountArray = [];
          this.binNameArray = [];

          this.zoneGraphFullData = storeZoneBinDetails;

          console.log("storeZoneBinDetails", storeZoneBinDetails);

          storeZoneBinDetails.forEach((zone: any) => {
            console.log("zone:---", zone);


            zone.binDetails.forEach((bin: any) => {
              console.log("bin:---", bin);

              this.binCountArray.push(zone.binCount)

              if (zone.binCount > 0) {
                // this.binNameArray.push(bin.binName ?? "")
                this.binNameArray.push(bin.binCode ?? "")
              }

            })


          })

          // zoneAndBinData.forEach((store: any) => {
          //   console.log("store:---", store);

          //   store.storeZoneDetails.forEach((zone: any) => {
          //     console.log("zone:---", zone);

          //     this.zoneCountArray.push(zone.binCount);
          //     if (store.storeZoneDetailsCount > 0) {
          //       this.zoneNameArray.push(zone.zoneCode ?? "")
          //       this.zoneGraphFullData.push(zone);

          //       // this.zoneNameArray.push(zone.zoneName ?? "")

          //       zone.binDetails.forEach((bin: any) => {
          //         console.log("bin:---", bin);

          //         this.binCountArray.push(zone.binCount)

          //         if (zone.binCount > 0) {
          //           // this.binNameArray.push(bin.binName ?? "")
          //           this.binNameArray.push(bin.binCode ?? "")
          //         }

          //       })
          //     } else if (store.storeZoneDetailsCount == 0) {

          //     }

          //   })
          // });
          console.log("aaaaaaa:----", { zoneCountArray: this.zoneCountArray, binCountArray: this.binCountArray, zoneNameArray: this.zoneNameArray, binNameArray: this.binNameArray });


          const storeColorsArray = this.generateColors(storeData.storeNamesArray.length);
          const partTypeColorsArray = this.generateColors(partTypeData.partTypeArray.length);
          const zoneColorsArray = this.generateColors(partTypeData.partTypeArray.length);
          const binColorsArray = this.generateColors(partTypeData.partTypeArray.length);

          this.storeGraphOptions = {
            plugins: {
              legend: {
                labels: false
              },
              tooltip: {
                callbacks: {
                  label: function (context: any) {
                    var value = context.formattedValue;
                    return context.label + ', Zones (' + value + ')';   // Tool Tip -> Store<Name>, Zones (Count) 
                  }
                }
              },
              // doughnutLabel: {
              //   labels: [
              //     {
              //       text: '550',
              //       font: {
              //         size: 20,
              //         weight: 'bold',
              //       },
              //     },
              //     {
              //       text: 'total',
              //     },
              //   ],
              // },
            },

          };

          this.storeGraphData = {
            labels: storeData.storeNamesArray,
            datasets: [
              {
                data: storeData.storeZoneCountsArray,
                backgroundColor: storeColorsArray,
                hoverBackgroundColor: storeColorsArray
              }
            ]
          }


          // part type
          this.partTypeData = {
            labels: partTypeData.partTypeArray,
            datasets: [
              {
                // label: 'Part Type',
                // data: partTypeData.partTypeCountArray,
                data: partTypeData.partTypePercentageArray,
                backgroundColor: partTypeColorsArray,
                borderColor: partTypeColorsArray,
              }
            ]
          };

          // zone graph 
          console.log("this.zoneNameArray", this.zoneNameArray);
          console.log("this.zoneCountArray", this.zoneCountArray);
          console.log("this.zoneNameArray.length", this.zoneNameArray.length);

          this.zoneChartData = {
            labels: storeZoneDetailNames,
            datasets: [
              {
                backgroundColor: this.generateColors(storeZoneDetailNames.length),
                // data: this.zoneCountArray
                data: storeZoneBinDetailCount
              },

            ]
          };


          this.zoneChartOptions = {
            plugins: {
              legend: {
                labels: false
              },
              tooltip: {
                callbacks: {
                  label: function (context: any) {
                    var value = context.formattedValue;
                    return context.label + ', Bin (' + value + ')';   // Tool Tip -> Zone<Name>, Bin (Count) 

                  }
                }
              },
            },
            onClick: (event: any, chartElements: any) => {
              if (chartElements.length > 0) {
                const datasetIndex = chartElements[0].datasetIndex;
                const dataIndex = chartElements[0].index;
                console.log("Index:----", { datasetIndex, dataIndex });
                console.log("this.zoneNameArray", this.zoneNameArray);
                console.log("chartElements", chartElements);

                console.log("zoneAndBinData", this.zoneAndBinData);
                console.log("zoneAndBinData", this.zoneAndBinData[dataIndex]);
                let selectedZoneDetails = this.zoneGraphFullData[dataIndex];
                this.selectedZoneGraphRecords = selectedZoneDetails;
                const selectedBinDetails = selectedZoneDetails?.binDetails;

                console.log("selectedZoneDetails", this.zoneGraphFullData[dataIndex]);
                // this.binGraphData = selectedZoneDetails.binDetails.map(item => item.binCode);
                const formValues = this.editSaveForm.getRawValue();
                let binValue = formValues?.bin?.map((bin: { storeBinDetailId: any }) => bin?.storeBinDetailId) ?? [];
                console.log("binValue", binValue); // bin values in  [12,13,67]

                let selectedBinRecords;
                let selectedBinCounts;
                if (binValue.length) {

                  selectedBinRecords = selectedBinDetails
                    .filter((item: { storeBinDetailId: any; }) => binValue.includes(item.storeBinDetailId))
                    .map((item: { binCode: any; }) => item.binCode);
                  selectedBinCounts = Array(selectedBinRecords?.length).fill(1);
                } else {
                  selectedBinRecords = selectedBinDetails.map((item: { binCode: any; }) => item.binCode);
                  selectedBinCounts = Array(selectedBinDetails?.length).fill(1);
                }

                console.log("selectedBinRecords", selectedBinRecords);
                console.log("selectedBinCounts", selectedBinCounts);
                this.isBinAvailable = selectedBinRecords.length ? true : false;

                this.binGraphData = {
                  labels: selectedBinRecords,
                  datasets: [
                    {
                      data: selectedBinCounts,
                      backgroundColor: this.generateColors(selectedBinCounts.length),
                      hoverBackgroundColor: this.generateColors(selectedBinCounts.length)
                    }
                  ]
                }

                this.binGraphOptions = {
                  plugins: {
                    legend: {
                      labels: false
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context: any) {
                          var value = context.formattedValue;
                          return context.label + value;
                        }
                      }
                    },
                  },

                };


                // Access the clicked data point
                const clickedData = this.zoneChartData.datasets[datasetIndex].data[dataIndex];
                this.handleShowPopup();

                // Handle the click for the specific record
                console.log(`Clicked Data: ${clickedData}`);
              }
            }
          };


        }
      })
  }



  // graph API  end


  getActiveDepot() {
    this.stockMaintenanceService
      .getActiveDepot(this.currentUserId)
      .subscribe((res) => {
        if (res.status === true) {
          if (res.response.length === 1) {
            this.editSaveForm.controls['depot'].setValue(res.response[0]);
            this.editSaveForm.controls['depot'].disable();
          } else {
            this.associatedDepots = res.response;
          }
        }
      });
  }
  onDepotSelected(event: any) {
    let depotIds = event.map((items: any) => items.depotId);
    this.getActiveStore(depotIds);
  }

  getActiveStore(depotIds: any) {
    this.stockMaintenanceService.getActiveStore(depotIds)
      .subscribe((res) => {
        if (res.status === true) {
          this.storeDDList = res.response;
        }
      })
  }
  onStoreSelected(event: any) {
    let storeIds = event.map((items: any) => items.storeId);
    this.getZoneByStore(storeIds);
  }
  getZoneByStore(storeIds: any) {
    this.stockMaintenanceService.getZoneByStore(storeIds)
      .subscribe((res) => {
        if (res.status === true) {
          this.zoneDDList = res.response;
        }
      })
  }
  onZoneSelected(event: any) {
    let zoneIds = event.map((items: any) => items.storeZoneDetailId);
    this.getBinByZone(zoneIds);
  }
  getBinByZone(zoneIds: any) {
    this.stockMaintenanceService.getBinByZone(zoneIds)
      .subscribe((res) => {
        if (res.status === true) {
          this.binDDList = res.response;
        }
      })
  }
  getPartType() {
    this.stockMaintenanceService.getPartType().subscribe((res) => {
      if (res.status === true) {
        this.partTypeDDList = res.response;
      }
    })
  }

  searchRecordsList() {
    this.getServerSideTable(this.paramsGlobal);
  }




  getPartTypeOptions() {
    this.partTypeOptions = {
      plugins: {
        legend: {
          labels: false
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              var value = context.formattedValue;
              return context.label + ' : ' + value + ' %';   // Tool Tip -> part type %
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#4a3e2d"
          },
          grid: {
            color: "#73716f",
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: "#4a3e2d"
          },
          grid: {
            color: "#73716f",
            drawBorder: false
          }
        }
      }
    };
  }

  getServerSideTable(params: any): void {
    this.paramsGlobal = params;
    const formValues = this.editSaveForm.getRawValue();
    // const depotArray = Array.isArray(formValues?.depot)? formValues.depot : [];
    this.serverSideProcessing = {
      ...params,
      currentPage: params?.first || 0,
      globalFilter:
        params?.globalFilter != undefined
          ? params?.globalFilter
          : this.stockMaintenanceList != undefined
            ? this.stockMaintenanceList?.sharedLazyTableNew?.globalFilter.value
            : null,
      pageSize: params?.rows,
      sortField: params.sortField ? params.sortField : 'sortOnly',
      sortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,

      depot: this.tableFilterFormGroup.value.depot ? this.tableFilterFormGroup.value.depot : '',
      store: this.tableFilterFormGroup.value.store ? this.tableFilterFormGroup.value.store : '',
      zoneName: this.tableFilterFormGroup.value.zoneName ? this.tableFilterFormGroup.value.zoneName : '',
      bin: this.tableFilterFormGroup.value.bin ? this.tableFilterFormGroup.value.bin : '',
      partType: this.tableFilterFormGroup.value.partType ? this.tableFilterFormGroup.value.partType : '',
      partName: this.tableFilterFormGroup.value.partName ? this.tableFilterFormGroup.value.partName : '',
      partCode: this.tableFilterFormGroup.value.partCode ? this.tableFilterFormGroup.value.partCode : '',
      partCategory: this.tableFilterFormGroup.value.partCategory ? this.tableFilterFormGroup.value.partCategory : '',
      stockUOM: this.tableFilterFormGroup.value.stockUom ? this.tableFilterFormGroup.value.stockUom : '',
      currency: this.tableFilterFormGroup.value.currency ? this.tableFilterFormGroup.value.currency : '',
      totalStockValue: this.tableFilterFormGroup.value.totalStockValue ? this.tableFilterFormGroup.value.totalStockValue : '',
      availableStock: this.tableFilterFormGroup.value.availableStock ? this.tableFilterFormGroup.value.availableStock : '',
      remarks: this.tableFilterFormGroup.value.remarks ? this.tableFilterFormGroup.value.remarks : '',
      searchDepot: formValues?.depot?.map((depot: { depotId: any }) => depot?.depotId) ?? [],
      searchStore: formValues?.store?.map((store: { storeId: any }) => store?.storeId) ?? [],
      searchZone: formValues?.zone?.map((zone: { storeZoneDetailId: any }) => zone?.storeZoneDetailId) ?? [],
      searchBin: formValues?.bin?.map((bin: { storeBinDetailId: any }) => bin?.storeBinDetailId) ?? [],
      searchPartType: formValues?.partType?.map((partType: { partTypeId: any }) => partType?.partTypeId) ?? [],
      isStockSummary: this.isStockMaintenance,
      totalAvailableStock: this.tableFilterFormGroup.value?.totalAvailableStock ? this.tableFilterFormGroup.value?.totalAvailableStock : '',
      partRate: this.tableFilterFormGroup.value?.partRate ? this.tableFilterFormGroup.value?.partRate : '',
    };
    this.searchStockMaintenance(this.serverSideProcessing)
  }
  searchStockMaintenance(params: any) {
    this.loaderService.start();
    this.getStoreGraph();
    this.stockMaintenanceService.getStockMaintenanceListServerSide(params,
      this.currentCompanyId, this.currentUserId
    ).subscribe((data: any) => {
      if (data.status == true) {

        this.stockMaintenanceData = data.response.result;
        const first = params.first;
        this.stockMaintenanceData = this.stockMaintenanceData.map((item: any, index: number) => ({ ...item, sNo: first + index + 1 }));
        this.totalDataGridCountComp = data['response'].filterRecordCount;
        this.sharedTableStoreService.setAssignGridData({ data, params });
        this.sharedTableStoreService.setResetTableData(true);
        this.totalStockValue = this.stockMaintenanceData.reduce((accumulator: any, currentValue: any) => {
          return accumulator + currentValue.totalStockValue;
        }, 0);
      }
      this.loaderService.stop();
    });
  }

  exportToExcel(event: any) {
    let newColumns = event?.columns?.filter(
      (key: any) => key.field != 'checkbox'
    );

    let params: any = { first: 0, rows: this.totalDataGridCountComp };
    newColumns?.map((item: { [x: string]: any; field: string }) => { });
    this.excelDataTable = [];
    this.excelDataTable.columns = newColumns;
    this.excelDataTable.filteredValue = undefined;
    let downloaded: boolean;

    const formValues = this.editSaveForm.getRawValue();
    let serverSideProcessing = {
      ...params,
      currentPage: params?.first || 0,
      globalFilter:
        params?.globalFilter != undefined
          ? params?.globalFilter
          : this.stockMaintenanceList != undefined
            ? this.stockMaintenanceList?.sharedLazyTableNew?.globalFilter.value
            : null,
      pageSize: params?.rows,
      sortField: params.sortField ? params.sortField : 'sortOnly',
      sortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,

      depot: this.tableFilterFormGroup.value.depot ? this.tableFilterFormGroup.value.depot : '',
      store: this.tableFilterFormGroup.value.store ? this.tableFilterFormGroup.value.store : '',
      zoneName: this.tableFilterFormGroup.value.zoneName ? this.tableFilterFormGroup.value.zoneName : '',
      bin: this.tableFilterFormGroup.value.bin ? this.tableFilterFormGroup.value.bin : '',
      partType: this.tableFilterFormGroup.value.partType ? this.tableFilterFormGroup.value.partType : '',
      partName: this.tableFilterFormGroup.value.partName ? this.tableFilterFormGroup.value.partName : '',
      partCode: this.tableFilterFormGroup.value.partCode ? this.tableFilterFormGroup.value.partCode : '',
      partCategory: this.tableFilterFormGroup.value.partCategory ? this.tableFilterFormGroup.value.partCategory : '',
      stockUOM: this.tableFilterFormGroup.value.stockUom ? this.tableFilterFormGroup.value.stockUom : '',
      currency: this.tableFilterFormGroup.value.currency ? this.tableFilterFormGroup.value.currency : '',
      totalStockValue: this.tableFilterFormGroup.value.totalStockValue ? this.tableFilterFormGroup.value.totalStockValue : '',
      availableStock: this.tableFilterFormGroup.value.availableStock ? this.tableFilterFormGroup.value.availableStock : '',
      remarks: this.tableFilterFormGroup.value.remarks ? this.tableFilterFormGroup.value.remarks : '',
      searchDepot: formValues?.depot?.map((depot: { depotId: any }) => depot?.depotId) ?? [],
      searchStore: formValues?.store?.map((store: { storeId: any }) => store?.storeId) ?? [],
      searchZone: formValues?.zone?.map((zone: { storeZoneDetailId: any }) => zone?.storeZoneDetailId) ?? [],
      searchBin: formValues?.bin?.map((bin: { storeBinDetailId: any }) => bin?.storeBinDetailId) ?? [],
      searchPartType: formValues?.partType?.map((partType: { partTypeId: any }) => partType?.partTypeId) ?? [],
      isStockSummary: this.isStockMaintenance,
      totalAvailableStock: this.tableFilterFormGroup.value?.totalAvailableStock ? this.tableFilterFormGroup.value?.totalAvailableStock : '',
      partRate: this.tableFilterFormGroup.value?.partRate ? this.tableFilterFormGroup.value?.partRate : '',
    };

    this.loaderService.start();
    this.stockMaintenanceService.getStockMaintenanceListServerSide(
      serverSideProcessing, this.currentCompanyId, this.currentUserId
    ).subscribe((data: any) => {
      if (data.status === true) {

        this.excelDataTable.value = data['response'].result;
        downloaded = this.excelService.exportAsExcelFile(
          this.excelDataTable,
          'Stock Summary List',
          false
        );
      }
      this.loaderService.stop();
    });
  }
  getCurrentStatusId(cardName: string, cardNumber: number = 1) {
    if (cardName == 'Stock') {
      this.isStockMaintenance = true;
    } else {
      this.isStockMaintenance = false;
    }

  }
}
