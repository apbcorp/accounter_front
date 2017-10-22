<?php

namespace DocumentBundle\Controller;

use DocumentBundle\Entity\PayDocument;
use KontragentBundle\Entity\Service;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use CoreBundle\Controller\BaseDocumentController;
use Symfony\Component\HttpFoundation\Response;

class PayController extends BaseDocumentController
{
    /**
     * @var string
     */
    protected $entity = PayDocument::class;

    /**
     * @Route("/pay/{id}")
     * @Method("GET")
     * @var int $id
     * @return JsonResponse
     */
    public function getAction($id)
    {
        return parent::getAction($id);
    }

    /**
     * @Route("/list/pay")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function listAction(Request $request)
    {
        return parent::listAction($request);
    }

    /**
     * @Route("/pay/delete/{id}")
     * @Method("GET")
     * @var int $id
     * @return JsonResponse
     */
    public function deleteAction($id)
    {
        return parent::deleteAction($id);
    }

    /**
     * @Route("/pay/{id}")
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
     * @Route("/pay")
     * @Method("POST")
     * @var Request $request
     * @return JsonResponse
     */
    public function postAction(Request $request)
    {
        return parent::postAction($request);
    }

    /**
     * @Route("/debt/{groundId}/{serviceId}")
     * @Method("POST")
     * @var Request $request
     * @var int     $groundId
     * @var int     $serviceId
     * @return JsonResponse
     */
    public function getDebtAction(Request $request, $groundId, $serviceId)
    {
        $date = new \DateTime($request->get('date'));
        $service = $this->getDoctrine()->getManager()->getRepository(Service::class)->find($serviceId);

        if (!$date || !$service) {
            return $this->sendResponse([], Response::HTTP_BAD_REQUEST);
        }

        $generator = $this->get('document.generator.debt');

        return $this->sendResponse($generator->getDebtByService($date, $groundId, $service), Response::HTTP_OK);
    }

    /**
     * @Route("/all_debt/{groundId}")
     * @Method("POST")
     * @var Request $request
     * @var int     $groundId
     * @return JsonResponse
     */
    public function getAllPayAction(Request $request, $groundId)
    {
        $date = new \DateTime($request->get('date'));
        $generator = $this->get('document.generator.debt');

        return $this->sendResponse($generator->getDebtByGround($date, $groundId, $this->getUnitId()), Response::HTTP_OK);
    }
}