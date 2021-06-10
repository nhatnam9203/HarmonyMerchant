import React from 'react';
import {
    View,
    Image,
    ScrollView,
} from 'react-native';

import { Text, HeaderLogoTop, ButtonCustom, Button, StatusBarHeader } from '@components';
import { scaleSize, localize, checkIsTablet } from '@utils';
import styles from './style';
import IMAGE from '@resources';

export default class Layout extends React.Component {

    render() {
        const { isAgreeTerm, language } = this.props;
        const temptIconCheck = isAgreeTerm ? IMAGE.checkBox : IMAGE.checkBoxEmpty;
        const temptBackgroundButton = isAgreeTerm ? '#0764B0' : '#F1F1F1';
        const temptColorTextButton = isAgreeTerm ? '#fff' : '#C5C5C5';

        return (
            <View style={styles.container} >
                <StatusBarHeader />
                <HeaderLogoTop />
                <View style={{ flex: 1, alignItems: 'center' }} >
                    <Text style={styles.textTitle} >
                        {localize('Terms of Service', language)}
                    </Text>
                    <View style={styles.termContainer} >
                        <View style={{ flex: 1, }} >
                            <ScrollView
                                showsVerticalScrollIndicato={false}
                                keyboardShouldPersistTaps="always"
                            >
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        HARMONY PAY, INC.
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        MERCHANT TERMS OF SERVICE
                                    </Text>
                                </View>
                                <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                    Effective: May 1, 2020
                                </Text>
                                <Text style={styles.contentTerms}>
                                    THESE MERCHANT USER TERMS OF SERVICE (“TERMS OF SERVICE”)
                                    FORM A BINDING AGREEMENT BETWEEN YOU (“YOU,” “YOUR”) AND
                                    HARMONY PAY, INC. (“HARMONY PAY,” “WE,” “US,” “OUR”)
                                    PLEASE READ THESE TERMS OF SERVICE CAREFULLY, BECAUSE BY DOWNLOADING,
                                    ACCESSING OR USING THE HARMONY PAY APPLICATION (“HARMONY PAY APP”),
                                    PRODUCTS AND/OR SERVICES (COLLECTIVELY, THE “SERVICES”) YOU ARE ACKNOWLEDGING
                                    THAT YOU HAVE READ, UNDERSTOOD AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE AND
                                    HARMONY PAY’S PRIVACY POLICY (“PRIVACY POLICY”). IF YOU DO NOT AGREE TO THESE TERMS OF
                                    SERVICE OR HARMONY PAY’S PRIVACY POLICY YOU MAY NOT DOWNLOAD, ACCESS OR USE THE SERVICES.
                                </Text>
                                <Text style={styles.contentTerms}>
                                    FROM TIME TO TIME WE MAY UPDATE OR MODIFY THESE TERMS OF SERVICE
                                    IN OUR DISCRETION. WE MAY PROVIDE NOTICE TO YOU OF THE UPDATED TERMS
                                    OF SERVICE BY EMAIL, AND/OR AN ON-SCREEN NOTIFICATION THROUGH
                                    THE SERVICES. THE UPDATED TERMS OF SERVICE WILL BECOME EFFECTIVE AS
                                    OF THE EFFECTIVE DATE INDICATED IN THE TERMS OF SERVICE (“EFFECTIVE DATE”).
                                    ANY USE OF THE SERVICES AFTER THE EFFECTIVE DATE MEANS YOU HAVE ACCEPTED
                                    THE UPDATED TERMS. YOUR SOLE AND EXCLUSIVE REMEDY IN THE EVENT YOU DO NOT
                                    ACCEPT THE UPDATED TERMS OF SERVICE IS TO CEASE YOUR ACCESS TO AND USE OF THE SERVICES.
                                </Text>
                                {/* --------- Row ------- */}
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        DESCRIPTION OF SERVICES
                                    </Text>
                                </View>
                                <Text style={styles.contentTerms}>
                                    Harmony Pay is a payment facilitator that allows you to accept
                                    credit and debit cards from customers for the payment for
                                    goods and services. We are not a bank and do not offer banking services.
                                    Our Payment Services allow you to accept payments from any US-issued
                                    and most non-US issued credit, debit, prepaid, or gift cards (“Cards”)
                                    bearing the trademarks of Visa Inc. (“Visa”), MasterCard International Inc.
                                    (“MasterCard”), American Express Travel Related Services Company, Inc.
                                    (“American Express”), and DFS Services, LLC (“Discover”), (collectively, the “Networks”).
                                    You are not required to accept any card brand as a condition of receiving the Payment Services.
                                    We may remove or add Cards that we accept at any time without prior notice.
                                    Harmony Pay is not a party to the transactions processed.
                                    Harmony Pay is an independent contractor. Harmony Pay does not assume liability
                                    over the transactions processed. We may conduct fraud and other background checks.
                                    We may delay the processing of a transaction that appear suspicious or involve fraud
                                    or other misconduct. We may also decline the processing of a transactions that is
                                    illegal or violate these Terms or Harmony Pay policies.
                                    </Text>
                                {/* --------- Row ------- */}
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        Use of the Platform
                                    </Text>
                                </View>
                                <Text style={styles.contentTerms}>
                                    You may only access and use the Services if you are an authorized user
                                    of a Harmony Pay customer (“Merchant”) pursuant to these Terms. Harmony
                                    Pay grants you a limited, revocable, non-exclusive, non-transferable
                                    license to access and use the applicable Services during the course of your
                                    relationship with Merchant, solely and exclusively for Merchant’s internal business purposes.
                                    </Text>
                                <Text style={styles.contentTerms}>
                                    You agree to use the Platform only for the management and operation of Merchant’s
                                    business pursuant to the terms and conditions of these Terms and not directly or
                                    indirectly: (a) reverse engineer, decompile, disassemble or otherwise attempt to
                                    discover the source code, object code or underlying structure, ideas or algorithms
                                    of the Services; (b) modify, translate, or create derivative works based on the Services;
                                    or copy (except for archival purposes), rent, lease, distribute, pledge, assign, or
                                    otherwise transfer or encumber rights to the Services; (c) use or access the Services to
                                    build or support, and/or assist a third party in building or supporting, products or services
                                    competitive with the Services; (d) remove or obscure any proprietary notices or labels
                                    from the Services; (e) use the Services for any fraudulent undertaking or in any manner
                                    that could damage, disable, overburden, impair or otherwise interfere with Harmony Pay's
                                    provisioning of the Services; (f) violate or breach any operating procedures, requirements
                                    or guidelines regarding Merchant’s use of the Services that are posted on or through the
                                    Harmony Pay App or otherwise provided or made available to Merchant; (g) alter, distribute,
                                    license, resell, transfer, assign, rent, lease, timeshare or otherwise commercially exploit
                                    the Services to any third- party or provide it as a service bureau; (h) conduct any penetration
                                    or vulnerability testing on the Services or network; or (i) copy any features, functions, text or
                                    graphics of the Services, including without limitation, the structure, sequence or organization of
                                    the user interface.
                                    </Text>
                                {/* --------- Row ------- */}
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        Fees
                                    </Text>
                                </View>
                                <Text style={styles.contentTerms}>
                                    You will be charged and agree to pay the following fees to use the Service,
                                    and all applicable taxes or other governmental assessments based on your use of the Service.
                                    </Text>

                                <Text style={[styles.contentTerms]}>
                                    We will charge you a fee of 2.0% of the total amount of each transaction processed. In the event the fees charged to us by
                                    the credit card companies to process your transaction exceeds the 2% fee we assessed,
                                    <Text style={[styles.contentTerms, { color: "#000" }]}>
                                        {` we will charge you the excess imposed by the credit card company without regard to whether this Agreement has expired or been terminated, rescinded or cancelled.`}
                                    </Text>
                                </Text>

                                <Text style={styles.contentTerms}>
                                    Fees:_______________________________________________________
                                    </Text>
                                <Text style={styles.contentTerms}>
                                    If you dispute any amounts you are charged, you must notify Harmony Pay
                                    in writing within 30 days of incurring the charge that you dispute. If you notify
                                    Harmony Pay after 30 days, you agree Harmony Pay has no obligation to effect any adjustments or refunds.
                                    </Text>

                                {/* --------- Row ------- */}
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        OWNERSHIP OF CONTENT, USE OF TRADEMARKS
                                    </Text>
                                </View>
                                <Text style={styles.contentTerms}>
                                    Harmony Pay owns or has license to all rights, title, interest,
                                    copyright and other worldwide intellectual property and trade secret
                                    rights in and to the Services (including all derivatives or improvements thereof).
                                </Text>
                                <Text style={styles.contentTerms}>
                                    User Content - You, (or Merchant, if applicable) retain all rights, title and interest
                                    in and to any text, graphics, videos, images or other data that you upload to the Services
                                    (“User Content”). You grant to Harmony Pay a non-exclusive, royalty-free, fully paid-up,
                                    worldwide license to access, use, copy, modify (including the right to create derivative works of),
                                    display and transmit User Content solely for the purpose of our providing the Services and in accordance
                                    with our Privacy Policy. You are solely responsible for the accuracy, quality, content and legality of
                                    User Content, the means by which User Content is acquired, and any transfer of User Content outside of
                                    the Services by you, Merchant or any third-party authorized by you. You represent, warrant and covenant
                                    that you have all rights necessary to upload the User Content to the Services and to otherwise have such
                                    User Content used or shared, as applicable, in relation to the Services.
                                </Text>
                                <Text style={styles.contentTerms}>
                                    Third-Party Content - Through your use of the Services you may be presented
                                    with material provided by third-parties, not owned or controlled by us,
                                    from our partners, and/or from other users of the Services, including but not
                                    limited to software, text, graphics, videos, images, or advertising content
                                    (collectively referred to as “Third-Party Content”). All Third-Party Content and the Services
                                    are protected by United States and foreign intellectual property laws. Unauthorized use of
                                    the Services and/or Third-Party Content may result in violation of copyright, trademark,
                                    and other laws. You have no rights in or to the Services or Third-Party Content, and you
                                    will not use, copy or display the Services or Third-Party Content except as permitted under
                                    these Terms of Service. No other use of the Services or Third-Party Content is permitted without
                                    our prior written consent. You must retain all copyright and other proprietary notices contained
                                    in the Services and Third-Party Content. You may not sell, transfer, assign, license, sublicense,
                                    or modify the Third-Party Content or reproduce, display, publicly perform, make a derivative version
                                    of, distribute, or otherwise use the Third-Party Content in any way for any public or commercial purpose
                                    other than as permitted hereunder. The use or posting of any of the Third-Party Content on any other platform,
                                    or in a networked computer environment for any purpose is expressly prohibited. If you violate any part
                                    of these Terms of Service, your right to access and/or use the Third-Party Content and Services will
                                    automatically terminate.
                                </Text>
                                <Text style={styles.contentTerms}>
                                    We do not review, pre-screen or filter all User Content, or Third-Party Content, but we do reserve
                                    the right to refuse to accept, or delete any User Content or Third-Party Content in our sole discretion.
                                    In addition, we have the right (but not the obligation) in our sole discretion to reject or delete any content
                                    that we reasonably consider to be in violation of these Terms of Service or applicable law. We do not guarantee
                                    the accuracy, integrity or quality of any Third-Party Content, regardless of whether such products or services
                                    are designated as “certified,” “validated” or the like. Any interaction or exchange of information or data between
                                    you and any third-party is solely between you and such third-party. You should take precautions when downloading
                                    files from any platform to protect your computer from viruses and other destructive programs. If you decide to
                                    access any Third-Party Content, you fully assume the risk of doing so. Under no circumstances will Harmony Pay be
                                    liable in any way for any Third-Party Content, including liability for any errors or omissions in any Third-Party
                                    Content or for any loss or damage of any kind incurred as a result of the use of any Third-Party Content posted,
                                    emailed or otherwise transmitted via the Services.
                                </Text>
                                <Text style={styles.contentTerms}>
                                    Each user must: (a) provide true, accurate, current and complete information on the Harmony Pay App’s
                                    registration form (collectively, the "Registration Data") and (b) maintain and promptly update
                                    the Registration Data as necessary. If, after investigation, we have reasonable grounds to suspect
                                    that any user's information is untrue, inaccurate, not current or incomplete, we may suspend or
                                    terminate that user's account and prohibit any and all current or future use of the Services
                                    (or any portion thereof) by that user other than as expressly provided herein. Each user is wholly
                                    responsible for maintaining the confidentiality and security of his/her username and password, and
                                    is wholly liable for all activities occurring thereunder. Harmony Pay cannot and will not be liable
                                    for any loss or damage arising from a user's failure to comply with this Terms, including any loss or
                                    damage arising from any user's failure to (a) immediately notify Harmony Pay of any unauthorized use
                                    of his or her password or account or any other breach of security, or (b) exit and close his or her account
                                    at the end of each session.
                                </Text>
                                <Text style={styles.contentTerms}>
                                    The trademarks, service marks, and logos of Harmony Pay (the “Harmony Pay Trademarks”) used
                                    and displayed on the Services are registered and unregistered trademarks or service marks of Harmony Pay.
                                    Other Harmony Pay product and service names located in the Services may be trademarks or service marks owned
                                    by third-parties (the “Third-Party Trademarks”, and, collectively with the Harmony Pay Trademarks, the “Trademarks”).
                                    Nothing in this Agreement should be construed as granting, by implication, estoppel, or otherwise, any license or
                                    right to use any Trademark displayed in the Services without the prior written consent of Harmony Pay specific for
                                    each such use. The Trademarks may not be used to disparage Harmony Pay or the applicable third-party, Harmony
                                    Pay’s or third-party’s products or services, or in any manner that may damage any goodwill in the Trademarks.
                                    Except as described herein, the use of any Trademarks is prohibited without Harmony Pay’s prior written consent.
                                    All goodwill generated from the use of any Harmony Pay Trademark or Third-Party Trademark will inure to Harmony
                                    Pay’s, or the applicable Third Party’s benefit, as applicable.
                                </Text>
                                {/* --------- Row ------- */}
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        Privacy
                                    </Text>
                                </View>
                                <Text style={styles.contentTerms}>
                                    Harmony Pay’s Privacy Policy describes what information we collect from you and other users of
                                    the Services, and how we use User Content and other information obtained through the Services.
                                    We encourage you to read the Privacy Policy carefully as it forms a binding part of these Terms of Service,
                                    and contains important information about your rights.
                                </Text>
                                {/* --------- Row ------- */}
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        Limitation of Liability and Disclaimer of Warranties
                                    </Text>
                                </View>
                                <Text style={styles.contentTerms}>
                                    EXCEPT FOR THE EXPRESS WARRANTIES SET FORTH HEREIN, HARMONY PAY AND ITS THIRD-PARTY PROVIDERS HEREBY
                                    DISCLAIM ALL EXPRESS OR IMPLIED WARRANTIES WITH REGARD TO THE SERVICES, INCLUDING BUT NOT LIMITED TO
                                    ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON- INFRINGEMENT
                                    AND QUALITY. HARMONY PAY AND ITS THIRD-PARTY PROVIDERS MAKE NO REPRESENTATIONS OR WARRANTIES REGARDING
                                    THE RELIABILITY, AVAILABILITY, TIMELINESS, SUITABILITY, ACCURACY OR COMPLETENESS OF THE SERVICES OR THE
                                    RESULTS YOU MAY OBTAIN BY USING THE SERVICES. WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, HARMONY
                                    PAY AND ITS THIRD-PARTY PROVIDERS DO NOT REPRESENT OR WARRANT THAT (A) THE OPERATION OR USE OF THE SERVICES
                                    WILL BE TIMELY, UNINTERRUPTED OR ERROR-FREE; OR (B) THE QUALITY OF THE SERVICES WILL MEET YOUR REQUIREMENTS.
                                    YOU ACKNOWLEDGE THAT NEITHER HARMONY PAY NOR ITS THIRD- PARTY PROVIDERS CONTROL THE TRANSFER OF DATA OVER
                                    COMMUNICATIONS FACILITIES, INCLUDING THE INTERNET, AND THAT THE SERVICES MAY BE SUBJECT TO LIMITATIONS,
                                    DELAYS, AND OTHER PROBLEMS INHERENT IN THE USE OF SUCH COMMUNICATIONS FACILITIES. HARMONY PAY IS NOT
                                    RESPONSIBLE FOR ANY DELAYS, DELIVERY FAILURES, OR OTHER DAMAGE RESULTING FROM SUCH PROBLEMS. WITHOUT LIMITING
                                    THE FOREGOING, HARMONY PAY DOES NOT WARRANT OR GUARANTEE THAT ANY OR ALL SECURITY ATTACKS WILL BE DISCOVERED,
                                    REPORTED OR REMEDIED, OR THAT THERE WILL NOT BE ANY SECURITY BREACHES BY THIRD PARTIES. EXCEPT WHERE EXPRESSLY
                                    PROVIDED OTHERWISE BY HARMONY PAY, THE SERVICES ARE PROVIDED TO MERCHANT ON AN "AS IS" BASIS.
                                </Text>
                                <Text style={styles.contentTerms}>
                                    IN NO EVENT WILL HARMONY PAY BE LIABLE UNDER ANY CONTRACT, NEGLIGENCE,
                                    STRICT LIABILITY OR OTHER THEORY, FOR ANY DIRECT, INDIRECT, SPECIAL,
                                    PUNITIVE, INCIDENTAL OR CONSEQUENTIAL DAMAGES, LOST PROFITS, OR DAMAGES RESULTING
                                    FROM LOST DATA OR BUSINESS INTERRUPTION RESULTING FROM OR IN CONNECTION WITH THE
                                    USE OR INABILITY TO USE THE SERVICES, EVEN IF HARMONY PAY HAS BEEN ADVISED OF THE
                                    POSSIBILITY OF SUCH DAMAGES AND EVEN IF A REMEDY SET FORTH HEREIN HAS FAILED ITS ESSENTIAL PURPOSE.
                                    TO THE MAXIMUM EXTENT PERMITTED BY LAW HARMONY PAY’S AGGREGATE LIABILITY TO YOU
                                    OR ANY THIRD PARTIES IN ANY CIRCUMSTANCE IS LIMITED TO ONE HUNDRED DOLLARS ($100).
                                </Text>
                                <Text style={styles.contentTerms}>
                                    Some states do not allow exclusion of implied warranties or limitation of
                                    liability for incidental or consequential damages, so the above limitations
                                    or exclusions may not apply to you. IN SUCH STATES, THE LIABILITY OF THE HARMONY
                                    PAY PARTIES WILL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
                                </Text>
                                {/* --------- Row ------- */}
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        Indemnification
                                    </Text>
                                </View>
                                <Text style={styles.contentTerms}>
                                    You agree to defend, indemnify and hold harmless Harmony Pay and its directors,
                                    officers, employees, affiliates and agents from and against any claims, actions or demands,
                                    including, without limitation, reasonable legal and accounting fees, arising or resulting from your
                                    breach of these Terms of Service or your access to, use or misuse of the Third-Party Content or Services.
                                    Harmony Pay will provide notice to you of any such claim, suit, or proceeding. Harmony Pay reserves the right
                                    to assume the exclusive defense and control of any matter which is subject to indemnification under this Section.
                                    In such case, you agree to cooperate with any reasonable requests assisting Harmony Pay’s defense of such matter.
                                </Text>
                                {/* --------- Row ------- */}
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        Termination of the Agreement
                                    </Text>
                                </View>
                                <Text style={styles.contentTerms}>
                                    Harmony Pay reserves the right, in its sole discretion, to restrict, suspend, or terminate
                                    these Terms of Service and your access to all or any part of the Services or User Content
                                    at any time and for any reason without prior notice or liability. Harmony Pay reserves the
                                    right to change, suspend, or discontinue all or any part of the Services at any time without
                                    prior notice or liability.
                                </Text>
                                <Text style={styles.contentTerms}>
                                    The terms related to the Use of the Platform, Limitation of Liability and Disclaimer of Warranties,
                                    Indemnification, Termination of Agreement and Miscellaneous terms will survive the termination of these
                                    Terms of Service.
                                </Text>
                                {/* --------- Row ------- */}
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        Arbitration
                                    </Text>
                                </View>
                                <Text style={styles.contentTerms}>
                                    Agreement to Arbitrate - This Section is referred to as the Arbitration Agreement.
                                    You agree that any and all disputes or claims that have arisen or may arise between
                                    you and Harmony Pay, whether arising out of or relating to these Terms of Service or
                                    in connection with your use of the Services, shall be resolved exclusively through final
                                    and binding arbitration, rather than a court, in accordance with the terms of this Arbitration Agreement,
                                    except that you may assert individual claims in small claims court, if your claims qualify.
                                    You agree that, by agreeing to these Terms of Service, you and Harmony Pay are each waiving
                                    the right to a trial by jury or to participate in a class action. Your rights will be determined by a
                                    neutral arbitrator, not a judge or jury. The Federal Arbitration Act governs the interpretation and
                                    enforcement of this Arbitration Agreement. Notwithstanding the foregoing, this Arbitration Agreement
                                    shall not preclude either party from pursuing a court action for the sole purpose of obtaining a temporary
                                    restraining order or preliminary injunction in circumstances in which such relief is appropriate, provided
                                    that any other relief shall be pursued through an arbitration proceeding pursuant to this Arbitration Agreement.
                                </Text>
                                <Text style={styles.contentTerms}>
                                    Prohibition of Class and Representative Actions and Non-Individualized Relief - You and Harmony Pay
                                    agree that each may bring claims against the other only on an individual basis and not as plaintiff
                                    or class member in any purported class or representative action or proceeding. Unless both you and Harmony
                                    Pay agree otherwise, the arbitrator may not consolidate or join more than one person’s or party’s claims
                                    and may not otherwise preside over any form of a consolidated, representative, or class proceeding. Also,
                                    the arbitrator may award relief (including monetary, injunctive, and declaratory relief) only in favor of
                                    the individual party seeking relief and only to the extent necessary to provide relief necessitated by that
                                    party’s individual claim(s).
                                </Text>
                                <Text style={styles.contentTerms}>
                                    Pre-Arbitration Dispute Resolution - Harmony Pay is always interested in resolving disputes amicably and efficiently,
                                    and most participant concerns can be resolved quickly and to the participant’s satisfaction by emailing Harmony Pay’s
                                    support team at ___________@HarmonyPayment.com. If such efforts prove unsuccessful, a party who intends to seek arbitration
                                    must first send to the other, by certified mail, a written Notice of Dispute (“Notice”). The Notice to Harmony Pay
                                    should be sent to Harmony Pay at 35246 US HWY 19 N. Suite 189, Palm Harbor, FL 34684 Att: Dispute (“Notice Address”).
                                    The Notice must (i) describe the nature and basis of the claim or dispute and (ii) set forth the specific relief sought.
                                    If you and Harmony Pay do not resolve the claim within sixty (60) calendar days after the Notice is received, you or
                                    Harmony Pay may commence an arbitration proceeding. During the arbitration, the amount of any settlement offer made by
                                    Harmony Pay or you shall not be disclosed to the arbitrator until after the arbitrator determines the amount, if any,
                                    to which you or Harmony Pay is entitled.
                                </Text>
                                <Text style={styles.contentTerms}>
                                    Arbitration Procedures - Arbitration will be conducted by a neutral arbitrator in accordance with the American Arbitration
                                    Association’s (“AAA”) rules and procedures, including the AAA’s Commercial Arbitration Rules (collectively, the “AAA Rules”),
                                    as modified by this Arbitration Agreement. If there is any inconsistency between any term of the AAA Rules and any term of
                                    this Arbitration Agreement, the applicable terms of this Arbitration Agreement will control unless the arbitrator determines
                                    that the application of the inconsistent Arbitration Agreement terms would not result in a fundamentally fair arbitration.
                                    All issues are for the arbitrator to decide, including, but not limited to, issues relating to the scope, enforceability,
                                    and arbitrability of this Arbitration Agreement. The arbitrator can award the same damages and relief on an individual basis
                                    that a court can award to an individual under these Terms of Service and applicable law. Decisions by the arbitrator are
                                    enforceable in court and may be overturned by a court only for very limited reasons. Unless you and Harmony Pay agree otherwise,
                                    any arbitration hearings will take place in a reasonably convenient location for both parties with due consideration of their
                                    ability to travel and other pertinent circumstances. If the parties are unable to agree on a location, the determination shall
                                    be made by AAA. If your claim is for $10,000 or less, Harmony Pay agrees that you may choose whether the arbitration will be
                                    conducted solely on the basis of documents submitted to the arbitrator, through a telephonic hearing or by an in-person hearing
                                    as established by the AAA Rules. If your claim exceeds $10,000, the right to a hearing will be determined by the AAA Rules.
                                    Regardless of the manner in which the arbitration is conducted, the arbitrator shall issue a reasoned written decision sufficient
                                    to explain the essential findings and conclusions on which the award is based.
                                </Text>
                                <Text style={styles.contentTerms}>
                                    Costs of Arbitration - Payment of all filing, administration, and arbitrator fees (collectively, the “Arbitration Fees”)
                                    will be governed by the AAA Rules, unless otherwise provided in this Arbitration Agreement. Any payment of attorneys’
                                    fees will be governed by the AAA Rules.
                                </Text>
                                <Text style={styles.contentTerms}>
                                    Confidentiality - All aspects of the arbitration proceeding, and any ruling, decision, or award by the arbitrator,
                                    will be strictly confidential for the benefit of all parties.
                                </Text>
                                <Text style={styles.contentTerms}>
                                    Severability - If a court or the arbitrator decides that any term or provision of this Arbitration Agreement,
                                    other than the Prohibition of Class and Representative Actions and Non-Individualized Relief, is invalid or unenforceable,
                                    the parties agree to replace such term or provision with a term or provision that is valid and enforceable and that comes
                                    closest to expressing the intention of the invalid or unenforceable term or provision,
                                    and this Arbitration Agreement shall be enforceable as so modified. If a court or the arbitrator decides that
                                    any of the provisions regarding the Prohibition of Class and Representative Actions and Non-Individualized Relief is
                                    invalid or unenforceable, then the entirety of this Arbitration Agreement shall be null and void.
                                    The remainder of these Terms of Service will continue to apply.
                                </Text>
                                {/* --------- Row ------- */}
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        Compliance with Laws
                                    </Text>
                                </View>
                                <Text style={styles.contentTerms}>
                                    You agree to comply with all federal, state, local and foreign laws, rules and regulations applicable
                                    to you and Merchant’s business in relation to your use of the Services, including any applicable tax laws
                                    and regulations, the then-current version of the Payment Card Industry Data Security Standards and the by-laws,
                                    and any and all other rules, policies and procedures of VISA, MasterCard, Discover and/or other card networks as
                                    in effect from time to time.
                                </Text>
                                <Text style={styles.contentTerms}>
                                    The United States controls the export of products and information. You expressly agree to comply with such restrictions
                                    and not to export or re-export any part of the Services to countries or persons prohibited under the export control laws.
                                    By accessing, using or downloading the Services, you are expressly agreeing that you are not in a country where such export
                                    is prohibited or are a person or entity for which such export is prohibited. You are solely responsible for compliance with
                                    the laws of your specific jurisdiction regarding the import, export or re-export of the Services.
                                </Text>
                                {/* --------- Row ------- */}
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        Consent to Electronic Communication
                                    </Text>
                                </View>
                                <Text style={styles.contentTerms}>
                                    You consent to receiving commercial electronic messages, including e-mail messages, SMS and text messages,
                                    and telephone calls, from Harmony Pay, its affiliates and its third party sales contractors and/or agents.
                                </Text>
                                {/* --------- Row ------- */}
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        Miscellaneous
                                    </Text>
                                </View>
                                <Text style={styles.contentTerms}>
                                    Any action, claim, or dispute related to these Terms of Service will be governed by the laws of the State of Florida,
                                    excluding its conflicts of law provisions, and controlling U.S. federal law. If any provision of these Terms of
                                    Service Agreement is found to be invalid by any court having competent jurisdiction, the invalidity of such provision
                                    will not affect the validity of the remaining provisions of these Terms of Service, which will remain in full force and
                                    effect. Failure of Harmony Pay to act on or enforce any provision of these Terms of Service will not be construed as a
                                    waiver of that provision or any other provision herein. No waiver will be effective against Harmony Pay unless made in
                                    writing, and no such waiver will be construed as a waiver in any other or subsequent instance.
                                    Except as expressly agreed by Harmony Pay and you, these Terms of Service constitute the entire agreement between
                                    you and Harmony Pay with respect to the subject matter hereof, and supersedes all previous or contemporaneous agreements,
                                    whether written or oral, between you and Harmony Pay with respect to the subject matter.
                                    The section headings are provided merely for convenience and will not be given any legal import.
                                    These Terms of Service will inure to the benefit of our successors and assigns. You may not assign these Terms of Service
                                    without our prior written consent. Any information submitted or provided by you to the Services might be publicly
                                    accessible. Important and private information should be protected by you.
                                </Text>
                                {/* --------- Row ------- */}
                                <View style={{ alignItems: 'center', marginVertical: scaleSize(10) }} >
                                    <Text style={[styles.contentTerms, { fontWeight: "bold", fontSize: scaleSize(14) }]}>
                                        Contacting Harmony Pay
                                    </Text>
                                </View>
                                <Text style={styles.contentTerms}>
                                    If you have any questions about these Terms, please contact Harmony Pay at
                                    team@harmonypayment.com.

                                </Text>
                            </ScrollView>
                        </View>

                    </View>
                    <View style={styles.checkboxContainer} >
                        <Button onPress={this.agreeTerm} style={{ width: scaleSize(30), justifyContent: 'center' }} >
                            <Image source={temptIconCheck} style={{ width: scaleSize(20), height: scaleSize(20) }} />
                        </Button>
                        <View style={{ justifyContent: 'center' }} >
                            <Text style={{ color: '#0764B0', fontSize: scaleSize(16) }} >
                                {localize('I agree to the Terms of Service.', language)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.buttonContainer} >
                        <ButtonCustom
                            width={scaleSize(250)}
                            height={60}
                            backgroundColor={temptBackgroundButton}
                            title={localize('ACCEPT', language)}
                            style={{
                                borderColor: '#C5C5C5',
                                borderWidth: 1
                            }}
                            textColor={temptColorTextButton}
                            onPress={this.nextScreen}
                        />
                    </View>
                </View>

                {/* ------------- Back Button --------------- */}

                <Button onPress={() => this.props.navigation.goBack()} style={{
                    width: scaleSize(50), height: scaleSize(50),
                    justifyContent: 'center', alignItems: 'center',
                    position: 'absolute',
                    top: checkIsTablet() ? scaleSize(90) : scaleSize(110),
                    left: scaleSize(20)

                }} >
                    <Text style={{
                        color: 'rgb(128,150,180)', fontSize: scaleSize(18), fontWeight: 'bold',
                        textDecorationLine: 'underline'
                    }} >
                        {localize('Back', language)}
                    </Text>
                </Button>


            </View>


        );
    }
}
