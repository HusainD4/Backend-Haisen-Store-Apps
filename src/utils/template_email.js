/**
 * Template HTML untuk Pengiriman OTP Reset Password
 * @param {string} otpCode - Kode OTP 4 digit acak
 * @returns {string} HTML string
 */
const generateResetPasswordEmailTemplate = (otpCode) => {
    return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Kode OTP - Haisen Store</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        /* Reset */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #F0EDE8; }

        /* Responsive */
        @media only screen and (max-width: 620px) {
            .main-container { width: 100% !important; }
            .otp-cell { width: 50px !important; height: 56px !important; font-size: 28px !important; }
            .content-pad { padding-left: 24px !important; padding-right: 24px !important; }
            .header-pad { padding: 32px 24px !important; }
            .footer-pad { padding: 24px !important; }
            .icon-circle { width: 56px !important; height: 56px !important; }
            .icon-circle img { width: 26px !important; height: 26px !important; }
        }

        @media only screen and (max-width: 400px) {
            .otp-cell { width: 42px !important; height: 48px !important; font-size: 24px !important; }
            .otp-gap { width: 8px !important; }
        }

        /* Preview text hide */
        .preview-text { display: none; font-size: 1px; color: #F0EDE8; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; }
    </style>
</head>
<body style="margin:0; padding:0; background-color:#F0EDE8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, Arial, sans-serif;">

    <!-- Preview Text -->
    <div class="preview-text">Kode verifikasi untuk mereset kata sandi akun Haisen Store Anda.</div>

    <!-- Full Width Wrapper -->
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#F0EDE8;">
        <tr>
            <td align="center" style="padding: 32px 16px;">

                <!-- Main Container -->
                <table role="presentation" class="main-container" width="580" border="0" cellpadding="0" cellspacing="0" style="max-width:580px; width:100%; background-color:#ffffff; border-radius:20px; overflow:hidden; box-shadow: 0 8px 40px rgba(60,40,50,0.08), 0 1px 3px rgba(60,40,50,0.04);">

                    <!-- Top Accent Bar -->
                    <tr>
                        <td style="height:5px; background: linear-gradient(90deg, #795465 0%, #A67B8B 50%, #795465 100%); font-size:0; line-height:0;">&nbsp;</td>
                    </tr>

                    <!-- Header -->
                    <tr>
                        <td class="header-pad" style="padding: 40px 40px 20px 40px; text-align:center; background-color:#ffffff;">
                            <!-- Logo -->
                            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 8px;">
                                        <img src="https://npitwgdkrtnrciqcmvfv.supabase.co/storage/v1/object/sign/logo/HaisenLogoOfficial.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zZGE2NDE3Mi0xNmNkLTRlMzMtODE1NC0yYTU5YWZhMGUwODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL0hhaXNlbkxvZ29PZmZpY2lhbC5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NDA3NzA2LCJleHAiOjIxMDA3Njc3MDZ9.KfwvEyM0fBYhn404D-uUHaHNWEiyDivYDU9ShHuTB6E" alt="Haisen Store" width="140" style="display:block; max-width:140px; width:100%; height:auto;">
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top:4px;">
                                        <span style="font-size:11px; font-weight:600; letter-spacing:3px; color:#A67B8B; text-transform:uppercase;">Official Store</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="height:1px; background: linear-gradient(90deg, transparent, #E4E2DE 20%, #E4E2DE 80%, transparent); font-size:0; line-height:0;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Icon Section -->
                    <tr>
                        <td align="center" style="padding: 28px 40px 0 40px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td class="icon-circle" width="68" height="68" style="width:68px; height:68px; background: linear-gradient(135deg, #F9F6F3 0%, #F0EBE6 100%); border-radius:50%; text-align:center; vertical-align:middle; border: 1px solid #E8E3DD;">
                                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%23795465' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3Ccircle cx='12' cy='16' r='1' fill='%23795465'/%3E%3C/svg%3E" alt="Security" width="30" height="30" style="display:inline-block; vertical-align:middle;">
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td class="content-pad" style="padding: 20px 40px 12px 40px; text-align:center;">
                            <h1 style="margin:0 0 8px 0; font-size:22px; font-weight:700; color:#1B1C1A; line-height:1.3;">Reset Kata Sandi Anda</h1>
                            <p style="margin:0; font-size:14px; color:#817478; line-height:1.7; max-width:400px; display:inline-block;">
                                Kami menerima permintaan untuk mereset kata sandi akun Anda. Masukkan kode verifikasi berikut untuk melanjutkan:
                            </p>
                        </td>
                    </tr>

                    <!-- OTP Code -->
                    <tr>
                        <td align="center" style="padding: 24px 40px 8px 40px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <!-- Digit 1 -->
                                    <td class="otp-cell" width="60" height="68" style="width:60px; height:68px; background: linear-gradient(180deg, #FFFFFF 0%, #FBF9F7 100%); border: 2px solid #E4E2DE; border-radius:14px; text-align:center; vertical-align:middle; font-size:32px; font-weight:800; color:#795465; letter-spacing:0;">
                                        <span style="line-height:68px;">${otpCode.charAt(0)}</span>
                                    </td>
                                    <!-- Gap -->
                                    <td class="otp-gap" width="12" style="width:12px; font-size:0;">&nbsp;</td>
                                    <!-- Digit 2 -->
                                    <td class="otp-cell" width="60" height="68" style="width:60px; height:68px; background: linear-gradient(180deg, #FFFFFF 0%, #FBF9F7 100%); border: 2px solid #E4E2DE; border-radius:14px; text-align:center; vertical-align:middle; font-size:32px; font-weight:800; color:#795465; letter-spacing:0;">
                                        <span style="line-height:68px;">${otpCode.charAt(1)}</span>
                                    </td>
                                    <!-- Gap -->
                                    <td class="otp-gap" width="12" style="width:12px; font-size:0;">&nbsp;</td>
                                    <!-- Digit 3 -->
                                    <td class="otp-cell" width="60" height="68" style="width:60px; height:68px; background: linear-gradient(180deg, #FFFFFF 0%, #FBF9F7 100%); border: 2px solid #E4E2DE; border-radius:14px; text-align:center; vertical-align:middle; font-size:32px; font-weight:800; color:#795465; letter-spacing:0;">
                                        <span style="line-height:68px;">${otpCode.charAt(2)}</span>
                                    </td>
                                    <!-- Gap -->
                                    <td class="otp-gap" width="12" style="width:12px; font-size:0;">&nbsp;</td>
                                    <!-- Digit 4 -->
                                    <td class="otp-cell" width="60" height="68" style="width:60px; height:68px; background: linear-gradient(180deg, #FFFFFF 0%, #FBF9F7 100%); border: 2px solid #E4E2DE; border-radius:14px; text-align:center; vertical-align:middle; font-size:32px; font-weight:800; color:#795465; letter-spacing:0;">
                                        <span style="line-height:68px;">${otpCode.charAt(3)}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Timer Badge -->
                    <tr>
                        <td align="center" style="padding: 16px 40px 8px 40px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #FFF8E7 0%, #FFF3D6 100%); border: 1px solid #F0DDB8; border-radius:100px; padding: 8px 20px; text-align:center;">
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="vertical-align:middle; padding-right:8px;">
                                                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23D4A017' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpolyline points='12 6 12 12 16 14'/%3E%3C/svg%3E" alt="Timer" width="14" height="14" style="display:block; vertical-align:middle;">
                                                </td>
                                                <td style="vertical-align:middle; font-size:12px; font-weight:600; color:#B8860B; letter-spacing:0.3px;">
                                                    Berlaku selama <strong>5 menit</strong>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Warning -->
                    <tr>
                        <td class="content-pad" style="padding: 20px 40px 32px 40px; text-align:center;">
                            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background:#FDF8F9; border-left:3px solid #D4A0A4; border-radius:0 10px 10px 0; padding:14px 18px; text-align:left;">
                                        <p style="margin:0; font-size:12px; color:#817478; line-height:1.6;">
                                            <strong style="color:#795465;">⚠ Penting:</strong> Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini. Jangan pernah membagikan kode OTP kepada siapa pun, termasuk pihak yang mengaku dari Haisen Store.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Bottom Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="height:1px; background: linear-gradient(90deg, transparent, #E4E2DE 20%, #E4E2DE 80%, transparent); font-size:0; line-height:0;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="footer-pad" style="padding: 28px 40px; text-align:center; background-color:#FDFCFB;">
                            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding-bottom:12px;">
                                        <img src="https://npitwgdkrtnrciqcmvfv.supabase.co/storage/v1/object/sign/logo/HaisenLogoOfficial.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zZGE2NDE3Mi0xNmNkLTRlMzMtODE1NC0yYTU5YWZhMGUwODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL0hhaXNlbkxvZ29PZmZpY2lhbC5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NDA3NzA2LCJleHAiOjIxMDA3Njc3MDZ9.KfwvEyM0fBYhn404D-uUHaHNWEiyDivYDU9ShHuTB6E" alt="Haisen Store" width="24" style="display:inline-block; opacity:0.4;">
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom:4px;">
                                        <p style="margin:0; font-size:11px; font-weight:600; color:#A0989C; letter-spacing:0.5px;">HAISEN STORE</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <p style="margin:0; font-size:11px; color:#B8B0B4; line-height:1.6;">
                                            &copy; ${new Date().getFullYear()} Haisen Store. Hak Cipta Dilindungi.<br>
                                            Email ini dikirim secara otomatis, mohon untuk tidak membalas.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
                <!-- End Main Container -->

            </td>
        </tr>
    </table>
    <!-- End Full Width Wrapper -->

</body>
</html>
    `;
};

module.exports = {
    generateResetPasswordEmailTemplate,
};