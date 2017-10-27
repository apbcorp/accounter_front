<?php

namespace DocumentBundle\Controller;

use CoreBundle\Controller\BaseDocumentController;
use CoreBundle\Dictionary\MetricTypeDictionary;
use DocumentBundle\Entity\MeterServiceDocument;
use DocumentBundle\Service\MeterServiceGenerator;
use KontragentBundle\Entity\Meter;
use KontragentBundle\Entity\Service;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Response;

class MeterServiceController extends BaseDocumentController
{
    /**
     * @var string
     */
    protected $entity = MeterServiceDocument::class;

    /**
     * @Route("/meter_service/{id}")
     * @Method("GET")
     * @var int $id
     * @return JsonResponse
     */
    public function getAction($id)
    {
        return parent::getAction($id);
    }

    /**
     * @Route("/list/meter_service")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function listAction(Request $request)
    {
        return parent::listAction($request);
    }

    /**
     * @Route("/meter_service/delete/{id}")
     * @Method("GET")
     * @var int $id
     * @return JsonResponse
     */
    public function deleteAction($id)
    {
        return parent::deleteAction($id);
    }

    /**
     * @Route("/meter_service/{id}")
     * @Method("POST")
     * @var Request $request
     * @var int     $id
     * @return JsonResponse
     */
    public function patchAction(Request $request, $id)
    {
        return parent::patchAction($request, $id);
    }

    /**
     * @Route("/meter_service")
     * @Method("POST")
     * @var Request $request
     * @return JsonResponse
     */
    public function postAction(Request $request)
    {
        return parent::postAction($request);
    }

    /**
     * @Route("/fill_meter_service_row")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function getServiceAction(Request $request)
    {
        $date = new \DateTime($request->get('date'));
        $meterId = $request->get('meterId');

        if (!$date || !$meterId) {
            return $this->sendResponse([], Response::HTTP_BAD_REQUEST);
        }

        $em = $this->getDoctrine()->getManager();
        /** @var Meter $meter */
        $meter = $em->getRepository(Meter::class)->find($meterId);

        if (!$meter) {
            return $this->sendResponse([], Response::HTTP_BAD_REQUEST);
        }

        $serviceSubType = MetricTypeDictionary::getServiceSubtypeByType($meter->getType());
        /** @var Service $service */
        $service = $em->getRepository(Service::class)->findOneBy([
            'deleted' => false,
            'subtype' => $serviceSubType
        ]);

        /** @var MeterServiceGenerator $generator */
        $generator = $this->get('document.generator.meter_service');

        return $this->sendResponse($generator->generateByMeter($date, $meter, $service), Response::HTTP_OK);
    }

    /**
     * @Route("/fill_meter_service")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function getAllServiceAction(Request $request)
    {
        $date = new \DateTime($request->get('date'));
        $groundId = $request->get('groundId');

        if (!$date || !$groundId) {
            return $this->sendResponse([], Response::HTTP_BAD_REQUEST);
        }

        $generator = $this->get('document.generator.meter_service');

        return $this->sendResponse($generator->generateByGroundId($date, $groundId), Response::HTTP_OK);
    }
}