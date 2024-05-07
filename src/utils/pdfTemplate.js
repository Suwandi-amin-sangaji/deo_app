import React, { useState, useCallback, useMemo } from 'react';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Asset } from 'expo-asset';
import { manipulateAsync } from 'expo-image-manipulator';
import formatTanggal from "@utils/formatTanggal";
import formatTampilanTanggal from "@utils/formatTampilanTanggal";
import formatTampilanJam from "@utils/formatTampilanJam";



const generateHTML = async (item, qrCode) => {
    const asset = Asset.fromModule(require('@assets/icon.png'));

    const image = await manipulateAsync(asset.localUri ?? asset.uri, [], { base64: true });
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>Example 3</title>
</head>

<body>

  <table style="border-collapse: collapse; width: 100%;">
    <tr>
      <td style="border: 1px solid black; padding: 8px; text-align: center; width: 50%; align-items: center;">
        <h1 style="font-family: Arial, Helvetica, sans-serif;">DEKLARASI KEAMANAN KIRIMAN</h1>
        <h4 style="font-family: Arial, Helvetica, sans-serif;">
          <i>CONSIGNMENT SECURITY DECLARATION (CSD)</i>
        </h4>
      </td>
    </tr>
  </table>


  <table style="border-collapse: collapse; width: 100%;">
    <tr>
      <td style="border: 1px solid black; padding: 8px; text-align: center; width: 50%;">
        <h1 style="font-size: x-large; font-family: Arial, Helvetica, sans-serif;color: black;">
          KANTOR BLU UPBU KELAS I DOMINE EDUARD OSOK - SORONG</h1>
      </td>
      <td style="border: 1px solid black; padding: 8px; text-align: center; width: 50%; align-items: center;">
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td
              style="border: 0px solid black; padding: 8px; text-align: left; width: 50%;font-family: Arial, Helvetica, sans-serif; ">
              OPERATOR
            </td>
            <td
              style="border: 0px solid black; padding: 8px; text-align: left; width: 50%;font-family: Arial, Helvetica, sans-serif; ">
              : ${item.m_op_airlines?.name || '-'}
            </td>
          </tr>

          <tr>
            <td
              style="border: 0px solid black; padding: 8px; text-align: left; width: 50%;font-family: Arial, Helvetica, sans-serif; ">
              NO PENERBANGAN
            </td>
            <td
              style="border: 0px solid black; padding: 8px; text-align: left; width: 50%;font-family: Arial, Helvetica, sans-serif; ">
              : ${item.no_penerbangan || '-'}
            </td>
          </tr>

          <tr>
            <td
              style="border: 0px solid black; padding: 8px; text-align: left; width: 50%;font-family: Arial, Helvetica, sans-serif; ">
              <span>NOMOR SMU</span>
              <br />
              <span><i>number of Airway Bill</i></span>
            </td>
            <td
              style="border: 0px solid black; padding: 8px; text-align: left; width: 50%; font-family: Arial, Helvetica, sans-serif;">
              : ${item.no_smu || '-'}
            </td>
          </tr>

          <tr>
            <td
              style="border: 0px solid black; padding: 8px; text-align: left; width: 50%; font-family: Arial, Helvetica, sans-serif;">
              TANGGAL PENERBANGAN
            </td>
            <td
              style="border: 0px solid black; padding: 8px; text-align: left; width: 50%; font-family: Arial, Helvetica, sans-serif;">
              : ${item.no_smu || '-'}
            </td>
          </tr>




        </table>
      </td>
    </tr>
  </table>



  <table style="border-collapse: collapse; width: 100%;">
    <tr>
      <td style="border: 1px solid black; border-bottom: none; padding: 8px; text-align: left; width: 100%;">
        CONTENT OF CONSIGNMENT :
      </td>
    </tr>
    <tr>
      <td style="border: 1px solid black; border-top: none; padding: 8px; text-align: left; width: 100%;">
      ${item.content || '-'}
      </td>
    </tr>
  </table>


  <table style="border-collapse: collapse; width: 100%;">
    <tr>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="border: 1px solid black; padding: 8px; text-align: left; width: 33.33%;">
            <div style="display: flex; justify-content: space-between;">
              <div>
                <span style="font-family: Arial, Helvetica, sans-serif;">ASAL</span>
                <br />
                <span style="font-family: Arial, Helvetica, sans-serif;"><i>origin</i></span>
              </div>
              <div>
                <span style="font-family: Arial, Helvetica, sans-serif;">
                  <h3><strong style="font-family: Arial, Helvetica, sans-serif;">${item.airport_asal?.name || '-'}</strong></h3>
                </span>
              </div>
            </div>
          </td>

          <td style="border: 1px solid black; padding: 8px; text-align: left; width: 33.33%;">
            <div style="display: flex; justify-content: space-between;">
              <div>
                <span style="font-family: Arial, Helvetica, sans-serif;">TUJUAN</span>
                <br />
                <span style="font-family: Arial, Helvetica, sans-serif;"><i>destination</i></span>
              </div>
              <div>
                <span style="font-family: Arial, Helvetica, sans-serif;">
                  <h3><strong>${item.airport_tujuan?.name || '-'}</strong></h3>
                </span>
              </div>
            </div>
          </td>
          <td style="border: 1px solid black; padding: 8px; text-align: left; width: 33.33%;">
            
              <div>
                <span style="font-family: Arial, Helvetica, sans-serif;">TRANSFER - TRANSIT</span>
                <br />
                <span style="font-family: Arial, Helvetica, sans-serif;"><i>Transfer - Transit Points</i></span>
              </div>
              <div>
              
                <span style="font-family: Arial, Helvetica, sans-serif;">
                ${item.transit_transfer || '-'}
                </span>
              </div>
           
          </td>
        </tr>
      </table>

    </tr>


    <tr>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>

          <table style="border-collapse: collapse; width: 100%;">
            <tr style="font-family: Arial, Helvetica, sans-serif;">

              <td rowspan="2" style="border: 1px solid black; padding: 8px; text-align: left; width: 33.33%;">
                <span style="font-family: Arial, Helvetica, sans-serif;">STATUS KEAMANAN</span>
                <br />
                <span style="font-family: Arial, Helvetica, sans-serif;"><i>security status</i></span>
                <br />

                <div
                  style="display: flex; justify-content: space-between; padding-left: 8px; padding-right: 8px; margin-top: 8px;">
                  <div style="border: 1px solid gray; padding: 2px; text-align: center; height: 18px; width: 22px;">
                    <span style="background-color: black; width: 16px; height: 6px;">${item.security_status == 'SPX'? 'BA':''}</span>
                  </div>
                  <div style="font-family: Arial, Helvetica, sans-serif;font-size: 12px;">
                    PASSENGER AIRCRAFT (SPX)
                  </div>
                </div>
                <div
                  style="display: flex; justify-content: space-between; padding-left: 8px; padding-right: 8px; margin-top: 8px;">
                  <div style="border: 1px solid gray; padding: 2px; text-align: center; height: 18px; width: 22px;">
                  <span style="background-color: black; width: 16px; height: 6px;">${item.security_status == 'SCO'? 'BA':''}</span>
                  </div>
                  <div style="font-family: Arial, Helvetica, sans-serif;font-size: 12px;">
                    PASSENGER AIRCRAFT (SPX)
                  </div>
                </div>
              </td>


              <td colspan="3" style="border: 1px solid black; padding: 8px; text-align: left; width: 66.66%;">
                <span style="font-family: Arial, Helvetica, sans-serif;font-size: 12px;">ALASAN DITERBITKAN STATUS KEAMANAN</span>
                <br />
                <span style="font-family: Arial, Helvetica, sans-serif;font-size: 12px;"><i>Reason for issuing Security
                    Status</i></span>

              </td>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 8px; text-align: left; ">
                
                  <div>
                    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 12px;">DITERIMA DARI</span>
                    <br />
                    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 12px;"><i>Received From </i></span>
                  </div>
                  <div>
                    <h6 style="font-family: Arial, Helvetica, sans-serif;">DEO-EM-${item.id}</h6>
                  </div>
               
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: left; ">
                
                
                  <div>
                    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 12px;"">METODE PEMERIKSAAN</span>
                    <br />
                    <span style="font-family: Arial, Helvetica, sans-serif;font-size: 12px;""><i>Screening Method</i></span>
                  </div>
                  <div>
                    <h6 style="font-family: Arial, Helvetica, sans-serif;">${item.screening_method || '-'}</h6>
                  </div>
              
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: left; ">
                
                  <div>
                    <span style="font-family: Arial, Helvetica, sans-serif;font-size: 12px;"">PENGECUALIAN PEMERIKSAAN</span>
                    <br />
                    <span style="font-family: Arial, Helvetica, sans-serif;font-size: 12px;""><i>Grounds for Exemptions (codes)</i></span>
                  </div>
                  <div>
                    <h6 style="font-family: Arial, Helvetica, sans-serif;">-</h6>
                  </div>
               
              </td>
            </tr>
          </table>

        </tr>
      </table>

    </tr>
  </table>



  <table style="border-collapse: collapse; width: 100%;">
    <tr>
      <td style="border: 1px solid black; padding: 8px; text-align: left; width: 100%;">
          <div>
            <span style="font-family: Arial, Helvetica, sans-serif;">METODE PEMERIKSAAN YANG LAIN (JIKA DITERAPKAN)</span>
            <br />
            <span style="font-family: Arial, Helvetica, sans-serif;"><i>Other Screening Methods (s) (if applicable)</i></span>
          </div>
          <br />
          <div>
            <span style="font-family: Arial, Helvetica, sans-serif;"></span>
          </div>
       
      </td>
    </tr>
  </table>


  <table style="border-collapse: collapse; width: 100%;">
    <tr>
      <td style="border: 1px solid black; padding: 8px; text-align: left; width: 50%;">
        <div>
          <span style="font-family: Arial, Helvetica, sans-serif;">STATUS KEAMANAN DITERBITKAN OLEH</span>
          <br />
          <span style="font-family: Arial, Helvetica, sans-serif;"><i>security status issued by</i></span>
        </div>
        <br />
        <div>
          
        </div>

        <div style="margin-top: 12px;">
          <span style="font-family: Arial, Helvetica, sans-serif;">NAMA PERSONIL</span>
          <br />
          <span style="font-family: Arial, Helvetica, sans-serif;"><i>name of person or employee ID</i></span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="font-family: Arial, Helvetica, sans-serif;">YORI G SARAPIL</span>
          <span>
          <img src="${qrCode}" style="width: 80px; height : 80px;" />
          </span>
        </div>
        


      </td>

      <td style="border: 1px solid black; padding: 8px; text-align: left; width: 50%;">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <span style="font-family: Arial, Helvetica, sans-serif;">STATUS KEAMANAN DITERBITKAN PADA</span>
            <br />
            <span style="font-family: Arial, Helvetica, sans-serif;"><i>security status issued on</i></span>
          </div>
          <br />
          <div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 12px;">
          <div>
            <span style="font-family: Arial, Helvetica, sans-serif;">TANGGAL /JAM</span>
            <br />
            <span style="font-family: Arial, Helvetica, sans-serif;"><i>date / time</i></span>
          </div>
          <br />
          <div>
            <span style="font-family: Arial, Helvetica, sans-serif;">19-01-2023 / 16:87 WIT</span>
            <br/>
            <span style="font-family: Arial, Helvetica, sans-serif;"><i>19-01-2023 / 16:87 UTC</i></span>
          </div>
        </div>
      </td>
    </tr>
  </table>

</html>
    `;
}


export default generateHTML;