<?php

namespace DocumentBundle\Controller;

use CoreBundle\Controller\BaseDocumentController;
use DocumentBundle\Entity\MeterDocument;
use DocumentBundle\Entity\PayDocument;
use DocumentBundle\Entity\ServiceDocument;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class ReportController extends BaseDocumentController
{
    /**
     * @Route("/report/main")
     * @Method("GET")
     * @return JsonResponse
     */
    public function mainReportAction(Request $request)
    {
        $dateStart = new \DateTime($request->get('dateStart'));
        $dateEnd = new \DateTime($request->get('dateEnd'));

        return $this->sendResponse(
            $this->getDoctrine()->getManager()->getRepository(ServiceDocument::class)->getReport($dateStart, $dateEnd, $this->getUnitId()),
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/report/balance")
     * @Method("GET")
     * @return JsonResponse
     */
    public function balanceReportAction(Request $request)
    {
        $dateStart = new \DateTime($request->get('dateStart'));
        $dateEnd = new \DateTime($request->get('dateEnd'));

        return $this->sendResponse($this->getDoctrine()->getManager()->getRepository(PayDocument::class)->getReport($dateStart, $dateEnd, $this->getUnitId()), Response::HTTP_OK);
    }

    /**
     * @Route("/report/meters")
     * @Method("GET")
     * @param Request $request
     * @return JsonResponse
     */
    public function metersReportAction(Request $request)
    {
        $dateStart = new \DateTime($request->get('dateStart'));
        $dateEnd = new \DateTime($request->get('dateEnd'));

        return $this->sendResponse($this->getDoctrine()->getManager()->getRepository(MeterDocument::class)->getReport($dateStart, $dateEnd, $this->getUnitId()), Response::HTTP_OK);
    }

    /**
     * @Route("/report/sms")
     * @Method("GET")
     * @return JsonResponse
     */
    public function smsReportAction()
    {

    }
}