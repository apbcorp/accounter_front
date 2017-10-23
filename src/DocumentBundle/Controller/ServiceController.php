<?php

namespace DocumentBundle\Controller;

use CoreBundle\Controller\BaseDocumentController;
use DocumentBundle\Entity\ServiceDocument;
use DocumentBundle\Service\ServiceGenerator;
use KontragentBundle\Entity\Service;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Response;

class ServiceController extends BaseDocumentController
{
    /**
     * @var string
     */
    protected $entity = ServiceDocument::class;

    /**
     * @Route("/service_document/{id}")
     * @Method("GET")
     * @var int $id
     * @return JsonResponse
     */
    public function getAction($id)
    {
        return parent::getAction($id);
    }

    /**
     * @Route("/list/service_document")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function listAction(Request $request)
    {
        return parent::listAction($request);
    }

    /**
     * @Route("/service_document/delete/{id}")
     * @Method("GET")
     * @var int $id
     * @return JsonResponse
     */
    public function deleteAction($id)
    {
        return parent::deleteAction($id);
    }

    /**
     * @Route("/service_document/{id}")
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
     * @Route("/service_document")
     * @Method("POST")
     * @var Request $request
     * @return JsonResponse
     */
    public function postAction(Request $request)
    {
        return parent::postAction($request);
    }

    /**
     * @Route("/fill_service_row")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function getServiceAction(Request $request)
    {
        $date = new \DateTime($request->get('date'));
        $groundId = $request->get('groundId');
        $serviceId = $request->get('serviceId');

        if (!$date || !$groundId || !$serviceId) {
            return $this->sendResponse([], Response::HTTP_BAD_REQUEST);
        }
        
        $service = $this->getDoctrine()->getManager()->getRepository(Service::class)->find($serviceId);
        
        if (!$service) {
            return $this->sendResponse([], Response::HTTP_BAD_REQUEST);
        }

        /** @var ServiceGenerator $generator */
        $generator = $this->get('document.generator.service');

        return $this->sendResponse($generator->generateByService($date, $groundId, $service), Response::HTTP_OK);
    }

    /**
     * @Route("/fill_service")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function getAllServiceAction(Request $request)
    {
        $date = new \DateTime($request->get('date'));
        $kontragentId = $request->get('kontragentId');

        if (!$date || !$kontragentId) {
            return $this->sendResponse([], Response::HTTP_BAD_REQUEST);
        }

        /** @var ServiceGenerator $generator */
        $generator = $this->get('document.generator.service');

        return $this->sendResponse($generator->generateByKontragent($date, $kontragentId), Response::HTTP_OK);
    }
}