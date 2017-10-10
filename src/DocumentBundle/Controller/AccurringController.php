<?php

namespace DocumentBundle\Controller;

use DocumentBundle\Entity\AccurringDocument;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use CoreBundle\Controller\BaseDocumentController;
use Symfony\Component\HttpFoundation\Response;

class AccurringController extends BaseDocumentController
{
    /**
     * @var string
     */
    protected $entity = AccurringDocument::class;

    /**
     * @Route("/accurring/{id}")
     * @Method("GET")
     * @var int $id
     * @return JsonResponse
     */
    public function getAction($id)
    {
        return parent::getAction($id);
    }

    /**
     * @Route("/list/accurring")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function listAction(Request $request)
    {
        return parent::listAction($request);
    }

    /**
     * @Route("/accurring/{id}")
     * @Method("DELETE")
     * @var int $id
     * @return JsonResponse
     */
    public function deleteAction($id)
    {
        return parent::deleteAction($id);
    }

    /**
     * @Route("/accurring/{id}")
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
     * @Route("/accurring")
     * @Method("POST")
     * @var Request $request
     * @return JsonResponse
     */
    public function postAction(Request $request)
    {
        return parent::postAction($request);
    }

    /**
     * @Route("/get_service/accurring")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function getServiceAction(Request $request)
    {
        $serviceId = $request->get('serviceId');
        $date = $request->get('date');
        $kontragentId = $request->get('kontragentId');

        if (!$serviceId || !$kontragentId || !$date) {
            return $this->sendResponse([], Response::HTTP_OK);;
        }

        $generator = $this->get('document.generator.service');

        return $this->sendResponse($generator->generateByServiceId($kontragentId, $serviceId, new \DateTime($date)), Response::HTTP_OK);
    }

    /**
     * @Route("/autofill/accurring")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function autofillAction(Request $request)
    {
        $kontragentId = $request->get('search');

        if (!$kontragentId) {
            return $this->sendResponse([], Response::HTTP_OK);
        }

        $generator = $this->get('document.generator.service');

        return $this->sendResponse($generator->getServicesByKontragent($kontragentId), Response::HTTP_OK);
    }
}